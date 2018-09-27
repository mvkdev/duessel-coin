const express 		= require('express'),
	  bodyParser	= require('body-parser'),
	  P2PServer		= require('./p2p-server'),
	  BlockChain    = require('./blockchain');


const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();
const p2pServer = new P2PServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req,res) => {
	res.json(bc.chain);
})

app.post('/mine', (req,res) => {
	const block = bc.addBlock(req.body.data);
	console.log(`New Block added: ${block.toString()}`);
	p2pServer.syncChains();
	res.redirect('/blocks');

})

app.listen(HTTP_PORT, () => console.log(`Blockchain Server listining on Port ${HTTP_PORT}...`));
p2pServer.listen();