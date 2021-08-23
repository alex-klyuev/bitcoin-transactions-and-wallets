const {
  createECDH,
  createHash
} = require('crypto');

const alice = createECDH('secp256k1');

alice.generateKeys();

console.log('private', alice.getPrivateKey('hex'));
console.log('public', alice.getPublicKey('hex'));


const hash = createHash('sha256');

hash.update(alice.getPublicKey('hex'));
const address = hash.digest('hex');
console.log('address', address);