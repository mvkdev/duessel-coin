const Transaction		= require('./transaction'),
	  Wallet			= require('./index');


describe('Transaction', () => {

	let transaction,wallet,recipient,amount;

	beforeEach(() => {
		wallet 		= new Wallet();
		amount 		= 50;
		recipient 	= 'r3c1p13nt';
		transaction = Transaction.newTransaction(wallet,recipient,amount);

	})

	it('outputs the amount substracted from the wallet balance', () => {
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
	})

	it('outputs the amount added to the recipient', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
	})

	it('inputs the balance of a wallet', () => {
		expect(transaction.input.amount).toEqual(wallet.balance);
	})

	it('validates a valid transaction', () => {
		expect(Transaction.verifyTransaction(transaction)).toBe(true);
	})

	it('rejects an invalid transaction', () => {
		transaction.outputs[0].amount = 500000;
		expect(Transaction.verifyTransaction(transaction)).toBe(false);
	})



	describe('rejects a transaction where the amount exceeds balance', () => {

		beforeEach(() => {
			amount = 5000000;
			transaction = Transaction.newTransaction(wallet,recipient,amount);
		})

		it('does not create transaction', () => {
			expect(transaction).toEqual(undefined);
		})
	})

	describe('updates an existing transaction', () => {
		let nextAmount, nextRecipient;

		beforeEach(() => {
			nextAmount = 20;
			nextRecipient = "Banana Joe";
			transaction = transaction.update(wallet,nextRecipient,nextAmount);
		})

		it('substracts the next amount from. senders output', () => {
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount -nextAmount);
		} )

		it('outputs an amount for the next recipient', () => {
			expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
		})



	})
})
