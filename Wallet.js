const {
  generateKeyPairSync,
  createHash,
} = require('crypto');

const Queue = require('./Queue.js');

class Wallet {
  constructor(username) {
    // name not actually necessary, include to help with UI
    this.username = username;

    // generate EC public-private keys in pem format
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
    this.privKey = privateKey;
    this.pubKey = publicKey;

    // generate address by putting public key through sha256 hash function
    const hash = createHash('sha256');
    hash.update(this.pubKey);
    this.address = hash.digest('hex');

    // use a queue to store UTXO's
    this.UTXOs = new Queue();
  }

  // send money to a different address
  send(address) {

  }

  // may not be implemented on this class
  receive() {

  }

  // show user balance by summing their UTXO's
  balance() {

  }

}

const aliceWallet = new Wallet('alice');

console.log(aliceWallet);