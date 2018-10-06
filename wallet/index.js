const { INITIAL_BALANCE }	= require('../config');
const Transaction = require('./transaction');
const chainUtil = require('../chain-util');

class Wallet {
	constructor() {
		this.balance = INITIAL_BALANCE;
		this.keyPair = chainUtil.genKeyPair();
		this.publicKey = this.keyPair.getPublic().encode('hex');
	}

	toString() {
		return ` Wallet	--- 
			Balance    : ${this.balance}
			Public Key : ${this.publicKey.toString()}`
	 	}

	sign(dataHash) {
		return this.keyPair.sign(dataHash);
	}

	createTransaction(recipient,amount,blockChain,transactionPool) {
		this.balance = this.calculateBalance(blockChain);
		if(amount > this.balance) {
			console.log(`Transaction Amount: ${amount} exceeds current Balance of ${this.balance}`);
			return
		}

    	let transaction = transactionPool.existingTransaction(this.publicKey);

		if(transaction) {
			transaction.update(this, recipient, amount);
		} else {
			transaction = Transaction.newTransaction(this, recipient, amount);
			transactionPool.updateOrAddTransaction(transaction);
		}

		return transaction;
	}

	calculateBalance(blockChain) {
		let balance = this.balance;
		let transactions = [];
		blockChain.chain.forEach(block => block.data.forEach(transaction => {
			transactions.push(transaction);
		}))

		const walletInputTs = transactions.filter(t => t.input.address === this.publicKey);

		let startTime = 0;

		if(walletInputTs.length > 0){
			const recentInputT = walletInputTs.reduce((prev,current) => {
				prev.input.timestamp > current.input.timestamp ? prev : current
			})
			balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
			startTime = recentInputT.input.timestamp;
		}

		transactions.forEach(transaction => {
			if(transaction.input.timestamp > startTime) {
				transaction.outputs.find(output => {
					if(output.address === this.publicKey)
						balance += output.amount;
					})
				}
		})

		return balance;
	}

	static blockChainWallet() {
		const blockChainWallet = new this;
		blockChainWallet.address = 'blockchain-wallet';
		return blockChainWallet;

	}
}

module.exports = Wallet;