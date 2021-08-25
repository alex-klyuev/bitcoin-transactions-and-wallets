const {
  createECDH,
  createHash,
  createSign,
  createVerify
} = require('crypto');

const alice = createECDH('secp256k1');

alice.generateKeys();

console.log('private', alice.getPrivateKey('pem'));
console.log('public', alice.getPublicKey('hex'));


const hash = createHash('sha256');

hash.update(alice.getPublicKey('hex'));
const address = hash.digest('hex');
console.log('address', address);

console.log(alice.getPrivateKey());

const privKey = alice.getPrivateKey('hex');
const pubKey = alice.getPublicKey('hex');
/*
const sign = createSign('SHA256');
const verify = createVerify('SHA256');

sign.update('JSON transaction data');
sign.end();
const sig = sign.sign(alice.getPrivateKey('utf-8'), 'hex');
console.log(sig);

verify.update('JSON transaction data');
verify.end();
console.log(verify.verify(alice.getPublicKey(), sig, 'hex'));

*/
