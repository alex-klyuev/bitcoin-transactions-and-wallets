// This class is the overarching structure that holds all of the transactions and users

class Chain {
  constructor() {
    // all the addresses must be stored for lookup by a User looking to send funds
    // address: publicKey are stored as key value pairs any time a new address is created
    // the pubKey is necessary for transactions, and allows the addresses to be verified
    this.addresses = {};
  }

}