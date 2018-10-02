const Block		= require('./block');

const {DIFFICULTY} = require('../config');


describe('Block', () => {
 let data,lastBlock, block;
 
 beforeEach(() => {
 	data = 'Banana Joe';
 	lastBlock = Block.genesis();
 	block = Block.mineBlock(lastBlock,data);
 });

 it('sets the `data`to match the input', () =>{
 	expect(block.data).toEqual(data);
 } );

 it('sets the `lastHash` to match the has of last block', () => {
 	expect(block.lastHash).toEqual(lastBlock.hash);
 })

 it('generates a hash that matches Difficulty', () => {
 	expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
 	console.log(block.toString());
 })

 it('expects to lower difficulty for a slowly mined block', () => {
 	expect(Block.adjustDifficulty(block,block.timestamp + 360000)).toEqual(block.difficulty-1);
 })

 it('raises difficulty for quickly mined blocks', () => {
 	expect(Block.adjustDifficulty(block,block.timestamp + 1)).toEqual(block.difficulty + 1);
 })

})
