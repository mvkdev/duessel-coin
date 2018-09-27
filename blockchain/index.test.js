const Blockchain = require('./index'),
	  Block 	 = require('./block');

describe('Blockchain', () => {
	let bc, bc2;

	beforeEach(()=>{
		bc = new Blockchain();
		bc2 = new Blockchain();
	});

	it('starts with genesis block',() => {
		expect(bc.chain[0]).toEqual(Block.genesis());
	});

	it('adds a new block to the chain', () => {
		const data = "Johnny";
		bc.addBlock(data);
		expect(bc.chain[bc.chain.length-1].data).toEqual(data);
	})

	it('validats a valid chain', () => {
		bc2.addBlock('Banana Joe');
		expect(bc.isValidChain(bc2.chain)).toBe(true);
	})

	it('invalidates a corrupt chain with a corrupt genesis block', () => {
		bc2.chain[0] = "Bad data";
		expect(bc.isValidChain(bc2.chain)).toBe(false);
	})

	it('invalidates a corrupt chain', () => {
		bc2.addBlock('Blub');
		bc2.chain[1].data = 'Bla';
		expect(bc.isValidChain(bc2.chain)).toBe(false);
	})

	it('replaces the chain with a valid chain', () => {
		bc2.addBlock('Johnny');
		bc.replaceChain(bc2.chain);

		expect(bc.chain).toEqual(bc2.chain);
	})

	it('does not replace chain with a chain of equal or lesser length', () => {
		bc.addBlock('Johnny');
		bc.replaceChain(bc2.chain);

		expect(bc.chain).not.toEqual(bc2.chain);
	})
})