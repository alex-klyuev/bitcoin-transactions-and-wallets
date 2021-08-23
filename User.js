const {
  createECDH,
  createHash
} = require('crypto');

class User {
  constructor(name) {
    // name not actually necessary, include to help with UI
    this.name = name;
    this.keys = createECDH('secp256k1');
    this.keys.generateKeys();

    const hash = createHash('sha256');
    hash.update(this.keys.getPublicKey('hex'));
    this.address = hash.digest('hex');
  }

}

const alice = new User('alice');

console.log(alice);