const TransactionPool 		= require('./transaction-pool'),
	  Transaction 			= require('./transaction'),
	  Wallet				= require('./index'),
	  BlockChain			= require('../blockchain');


describe('TransactionPool', () => {
	let transactionPool,transaction,wallet,bc;
	beforeEach(() => {
		tp = new TransactionPool();
		wallet = new Wallet();
		bc = new BlockChain();
		transaction = wallet.createTransaction('Banana Joe',30, bc, tp);

	})

	it('adds a transaction to the transactionPool', () =>{
		expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
	})

	it('updates a transaction already in the transactionPool', () => {
		const oldTransaction = JSON.stringify(transaction);
		const newTransaction = transaction.update(wallet,"Johnny Banana",bc, 20);
		tp.updateOrAddTransaction(newTransaction);

		expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
	})

	it('clears transaction pool', () => {
		tp.clear();
		expect(tp.transactions).toEqual([]);
	})


	describe('mixing valid and corrupt transactions',() => {
		let validTransactions;

		beforeEach(() => {
			validTransactions = [...tp.transactions];
			for (let i=0;i<6;i++) {
				wallet = new Wallet();
				transaction = wallet.createTransaction('Johnny Banana',30,bc,tp);
				if(i%2 == 0){
					transaction.input.amount = 1000000;
				} else {
					validTransactions.push(transaction);
				}
			}
		})

		it('shows a difference between valid and corrupt transactions', () => {
			expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(tp.validTransactions));
		})

		it('grabs valid transactions',() => {
			expect(tp.validTransactions()).toEqual(validTransactions);
		})
	})
})