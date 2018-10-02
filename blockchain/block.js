const crypto	 = require('crypto');

const locus 	 = require('locus');

const { DIFFICULTY, MINE_RATE } = require('../config');


class Block {
	constructor(timestamp,lastHash,hash,data,nonce,difficulty) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
		this.difficulty = difficulty || DIFFICULTY;
	}

	static adjustDifficulty(lastBlock,currentTime) {
		let { difficulty } = lastBlock;
		difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
		if(difficulty === 0) difficulty = 1;
		return difficulty;
	}

	toString() {
		return `Block --- 
			Timestamp  : ${this.timestamp}
			LastHash   : ${this.lastHash}
			Hash       : ${this.hash}
			Nonce 	   : ${this.nonce}
			Difficulty : ${this.difficulty}
			Data       : ${this.data}`;
	}

	static genesis() {
		return new this('Genesis Time','----','f1r57-h45h', [], 0, DIFFICULTY);
	}

	

	static mineBlock(lastBlock,data){
		let hash,timestamp;
		let nonce = 0;
		let { difficulty } = lastBlock;
		const lastHash  =  lastBlock.hash;
		do{
			nonce++;
			timestamp = Date.now();
			difficulty = Block.adjustDifficulty(lastBlock,timestamp);
			hash =  Block.hash(timestamp,lastHash,data, nonce,difficulty);
			}
		while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));

		return new this(timestamp,lastHash,hash,data,nonce,difficulty);
	}

	static hash(timestamp,lastHash,data,nonce,difficulty) {
		let  hashedData	 = crypto.createHash('sha256').update(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).digest('hex');
		return hashedData;
	}

	static blockHash(block) {
		const { timestamp, lastHash, data, nonce, difficulty } = block;
		return Block.hash(timestamp,lastHash, data, nonce, difficulty);
	}

}

module.exports = Block;