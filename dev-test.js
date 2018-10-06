const Wallet = require('./wallet');
const Transaction = require('./wallet/transaction');
const transactionPool = require('./wallet/transaction-pool');

const locus = require('locus');

const wallet = new Wallet();

console.log(wallet.toString());

let amount = 50;
let recipient = '<johnny';
let tp = new transactionPool();

let transaction;
transaction = wallet.createTransaction(recipient,amount,tp);

wallet.createTransaction(recipient,amount,tp);
wallet.createTransaction(recipient,amount,tp);

eval(locus);


