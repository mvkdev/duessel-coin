const Transaction		= require('./transaction'),
	  Wallet			= require('./index');


describe('Transaction', () => {

	let transaction,wallet,recipient,amount;

	beforeEach(() => {
		wallet 		= new Wallet();
		amount 		= 50;
		recipient 	= 'r3c1p13nt';
		transaction = new Transaction(wallet,recipient,amount);

	})

	it('outputs the amount substracted from the wallet balance', () => {
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
	})

	it('outputs the amount added to the recipient', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
	})


})

