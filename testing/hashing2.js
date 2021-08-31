const {
  generateKeyPairSync,
  createHash,
  createSign,
  createVerify
} = require('crypto');

const {
  publicKey,
  privateKey
} = generateKeyPairSync('ec', {
  namedCurve: 'secp256k1',
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'sec1',
    format: 'pem'
  }
});

console.log('KEYS:', publicKey, privateKey, '\n');

const addressHash = createHash('sha256');
addressHash.update(publicKey);
const address = addressHash.digest('hex');
console.log('ADDRESS:', address, '\n');

const sign = createSign('SHA256');
const verify = createVerify('SHA256');

sign.update('JSON transaction data');
sign.end();
const sig = sign.sign(privateKey, 'hex');
console.log('SIGNATURE:', sig, '\n');

verify.update('JSON transaction data');
verify.end();
console.log(verify.verify(publicKey, sig, 'hex'));

const hash1 = createHash('sha256');
// order matters with these
hash1.update(publicKey);
hash1.update('sometxid');
console.log(hash1.digest('hex'));

const hash2 = createHash('sha256');
hash2.update(publicKey);
hash2.update('sometxid');
console.log(hash2.digest('hex'));