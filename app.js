const express 			= require('express'),
	  bodyParser		= require('body-parser'),
	  P2PServer			= require('./p2p-server'),
	  BlockChain   		= require('./blockchain'),
	  Wallet			= require('./wallet'),
	  transactionPool 	= require('./wallet/transaction-pool'),
	  Miner				= require('./miner');

let ports = []; 


const HTTP_PORT = process.env.HTTP_PORT || 3001;


const app = express();
const bc = new BlockChain();
const wallet = new Wallet();
const tp = new transactionPool();
const p2pServer = new P2PServer(bc,tp);
const miner = new Miner(bc,tp,wallet,p2pServer);

app.use(bodyParser.json());

app.get('/blocks', (req,res) => {
	res.json(bc.chain);
})

app.get('/transactions', (req,res) => {
	res.json(tp.transactions);
})

app.post('/transact', (req,res) => {
	const {recipient,amount} = req.body;
	const transaction = wallet.createTransaction(recipient,amount,bc,tp);
	p2pServer.broadcastTransaction(transaction);
	res.redirect('/transactions');
})

app.get('/publickey', (req,res) => res.json({publickey: wallet.publicKey}));

app.get('/mine-transactions', (req,res) => {
	const block = miner.mine();
	console.log(`New Block added to BlockChain: ${block.toString()}`);
	res.redirect('/blocks');
})

app.post('/mine', (req,res) => {
	const block = bc.addBlock(req.body.data);
	console.log(`New Block added: ${block.toString()}`);
	p2pServer.syncChains();
	res.redirect('/blocks');

})

app.listen(HTTP_PORT, () => console.log(`Blockchain Server listining on Port ${HTTP_PORT}...`));
p2pServer.listen();