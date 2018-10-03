const EC 		= require('elliptic').ec,
	  uuidV1	= require('uuid/v1'),
	  crypto	= require('crypto');

const ec = new EC('secp256k1');

class ChainUtil {
	static genKeyPair(){
		return ec.genKeyPair();
	}
	static id(){
		return uuidV1();
	}

	static hash(data) {
		return crypto.createHash('SHA256').update(JSON.stringify(data)).digest('hex');
	}

	static verifySignature(publicKey, signature, dataHash) {
	 return ec.keyFromPublic(publicKey,'hex').verify(dataHash, signature);
}
} 

module.exports = ChainUtil;

