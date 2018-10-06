const webSocket 		= require('ws');

let ports = [];

const P2P_PORT = process.env.P2P_PORT || 5001;

// if PEERS exists, split the websockets addresses, else set PEERS to empty array.
// PEERS: ws://localhost:5001,ws:/localhost:5003 etc...

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPE = {
	chain: 'CHAIN',
	transaction: 'TRANSACTION',
	clear_transactions: 'CLEAR_TRANSACTIONS'
}

class P2PServer{

	constructor(blockchain,tp) {
		this.blockchain = blockchain;
		this.transactionPool = tp;
		this.sockets 	= [];
	}

	listen() {
		const server = new webSocket.Server({port: P2P_PORT});
		server.on('connection', (socket,req) => {
			console.log(peers);
			this.connectSocket(socket);
		})
		this.connect2Peers();

		console.log(`Listening for socket connections on ${P2P_PORT}`);
	}

	connect2Peers() {
		peers.forEach(peer => {
			//will be an address like ws://localhost:5001
			const socket = new webSocket(peer);
			socket.on('open', () => this.connectSocket(socket));
			})
		}

	connectSocket(socket) {
		this.sockets.push(socket);
		console.log('Socket connected');
		this.messageHandler(socket);
		socket.send(JSON.stringify(this.blockchain.chain));
	   }

	 messageHandler(socket) {
	 	socket.on('message', message => {
	 		const data = JSON.parse(message);

	 		switch(data.type) {
	 			case MESSAGE_TYPE.chain:
	 				this.blockchain.replaceChain(data.chain);
	 				break;

	 			case MESSAGE_TYPE.transaction:
	 				this.transactionPool.updateOrAddTransaction(data.transaction);
	 				break;

	 			case MESSAGE_TYPE.clear_transactions:
	 				this.transactionPool.clear();
	 				break;
	 			}
	 		})
	 }

	 sendChain(socket) {
	 	socket.send(JSON.stringify({type: MESSAGE_TYPE.chain, chain: this.blockchain.chain}));
	 }

	 sendTransaction(socket,transaction) {
	     socket.send(JSON.stringify({type: MESSAGE_TYPE.transaction, transaction}));
	 }

	 syncChains() {
	 	this.sockets.forEach(socket => {
	 		this.sendChain(socket);
	 	})
	 }

	 broadcastTransaction(transaction) {
	 	this.sockets.forEach(socket => {
	 		this.sendTransaction(socket,transaction);
	 	})
	 }

	 broadcastClearTransactions() {
	 	this.sockets.forEach(socket => JSON.stringify({type: MESSAGE_TYPE.clear_transactions}));
	 }

}

module.exports = P2PServer;

