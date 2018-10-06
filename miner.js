const Wallet 		= require('./wallet'),
	  Transaction 	= require('./wallet/transaction');


class Miner {
	constructor(blockchain,transactionPool,wallet,p2pserver) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pserver = p2pserver;
	}

	mine() {
		const validTransactions = this.transactionPool.validTransactions();
		validTransactions.push(Transaction.rewardTransaction(this.wallet,Wallet.blockChainWallet()));
		//create a block of the valid transactions
		const block = this.blockchain.addBlock(validTransactions);
		this.p2pserver.syncChains();
		this.transactionPool.clear();
		this.p2pserver.broadcastClearTransactions();
		//synchromize chains in the p2p server
		//clear the transaction pool
		// broadcast to all miners to clear their transaction pools as well
		return block;
	}
}


module.exports = Miner;