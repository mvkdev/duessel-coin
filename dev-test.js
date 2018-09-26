const Block		= require('./block');

const fooBlock = Block.mineBlock(Block.genesis(),'foo');
const secondBlock = Block.mineBlock(fooBlock,'banana');
console.log(fooBlock.toString());
console.log(secondBlock.toString());
