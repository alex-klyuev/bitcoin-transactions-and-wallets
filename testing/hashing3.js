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

const addressUserHash = createHash('sha256');
addressUserHash.update(publicKey);
const addressUser = addressUserHash.digest('hex');
console.log('ADDRESS:', addressUser, '\n');

const sign = createSign('SHA256');
const verify = createVerify('SHA256');

// testing whether signing the address with that user's private key proves ownership
// of that address. having the public key provided, anyone can verify that
// pubkey -> address and that they own that pubkey via the signature
sign.update(addressUser);
sign.end();
const sig = sign.sign(privateKey, 'hex');
console.log('SIGNATURE:', sig, '\n');

verify.update(addressUser);
verify.end();
const cond1 = verify.verify(publicKey, sig, 'hex');

const addressVerifyHash = createHash('sha256');
const addressVerify = addressVerifyHash.update(publicKey).digest('hex');
const cond2 = addressVerify === addressUser;

const isValid = cond1 && cond2;

console.log(isValid);

/*
const hash1 = createHash('sha256');
// order matters with these
hash1.update(publicKey);
hash1.update('sometxid');
console.log(hash1.digest('hex'));

const hash2 = createHash('sha256');
hash2.update(publicKey);
hash2.update('sometxid');
console.log(hash2.digest('hex'));
*/