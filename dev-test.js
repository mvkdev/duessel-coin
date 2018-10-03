const Wallet = require('./wallet');
const Transaction = require('./wallet/transaction');

const locus = require('locus');

const wallet = new Wallet();

console.log(wallet.toString());

let amount = 50;
let recipient = '<johnny';

let transaction = Transaction.newTransaction(wallet,recipient,amount);

console.log(Transaction.verifyTransaction(transaction));

eval(locus);


