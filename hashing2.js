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

const hash = createHash('sha256');
hash.update(publicKey);
const address = hash.digest('hex');
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