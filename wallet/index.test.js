const	Wallet			= require('./index'),
	  	Transaction		= require('./transaction'),
	  	TransactionPool = require('./transaction-pool'),
	  	BlockChain 		= require('../blockchain');

const {INITIAL_BALANCE} = require('../config');

describe('Wallet Transactions', () => {

	let wallet, tp,bc;

	beforeEach(() => {
		wallet = new Wallet();
		tp = new TransactionPool();
		bc = new BlockChain();
	})


	describe('creating a transaction', () => {
		let transaction, sendAmount, recipient, bc;

		beforeEach(() => {
			sendAmount = 50;
			recipient = "Banana Joe";
			bc = new BlockChain();
			transaction = wallet.createTransaction(recipient,sendAmount,bc,tp);
			
		})

		describe('and doing the same transaction', () => {
			beforeEach(() => {
				wallet.createTransaction(recipient,sendAmount,bc,tp);
			})

			it('doubles the send amount from the transaction', () => {
				expect(transaction.outputs.find(t => t.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
			})

			it('clones the sendAmount output for the recipient', () =>{
				expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount,sendAmount]);
			} )
		})
	})

	describe('calculating a balance', () => {
		let addBalance, repeatAdd, senderWallet;
		beforeEach(() => {
			senderWallet = new Wallet();
			addBalance = 100;
			repeatAdd = 3;

		for(let i=0;i<repeatAdd;i++ ){
			senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
		}

		bc.addBlock(tp.transactions);

	})

		it('calculates the balance for the recipient', () => {
			expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance*repeatAdd));
		})

		it('calculates the balance for the sender', () => {
			expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - ( addBalance*repeatAdd));
		})

		describe('and the recipient conducts a transaction', () => {
			let substractBalance,recipientBalance;

			beforeEach(() => {
				tp.clear();
				substractBalance = 60;
				recipientBalance = wallet.calculateBalance(bc);
				wallet.createTransaction(senderWallet.publicKey,substractBalance,bc,tp);
				bc.addBlock(tp.transactions);
			})

			describe('the sender sends another transaction to the recipient', () => {
				beforeEach(() => {
					tp.clear();
					senderWallet.createTransaction(wallet.publicKey, addBalance,bc,tp);
					bc.addBlock(tp.transactions);
				})

				it('calculates the recipient balance since the most recent one', () => {
					expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - substractBalance + addBalance);
				})


			})

		})
	})
})