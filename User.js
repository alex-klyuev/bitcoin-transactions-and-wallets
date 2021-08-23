const {
  createECDH,
  createHash
} = require('crypto');

const Queue = require('./Queue.js');

class User {
  constructor(name) {
    // name not actually necessary, include to help with UI
    this.name = name;
    this.keys = createECDH('secp256k1');
    this.keys.generateKeys();

    const hash = createHash('sha256');
    hash.update(this.keys.getPublicKey('hex'));
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

const alice = new User('alice');

console.log(alice);