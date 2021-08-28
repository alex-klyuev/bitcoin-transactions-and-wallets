const {
  createECDH,
  createHash,
  createSign,
  createVerify
} = require('crypto');

const KeyEncoder = require('key-encoder');
console.log(KeyEncoder);
const keyEncoder = new KeyEncoder('secp256k1');

const alice = createECDH('secp256k1');

alice.generateKeys();

console.log('private', alice.getPrivateKey('hex'));
console.log('public', alice.getPublicKey('hex'));

const privateKey = keyEncoder.encodePrivate(alice.getPrivateKey(), 'raw', 'pem');
console.log(privateKey);