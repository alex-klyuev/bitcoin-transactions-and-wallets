import { createHash, createSign } from 'crypto';
import generateWallet from '../functions/generateWallet';
import TXOutput from './TXOutput';

// Genesis is going to have similar functionality to a normal wallet,
// except it will lack a UI and have some extra functions.
// could be a good opportunity to reuse some functionality / use subclassing,
// but let's build out the functionality first
class Genesis {
  username: string;
  address: string;
  publicKey: string;
  privateKey: string;

  // Genesis will always have to keep track of its 1 current UTXO
  UTXO: TXOutput;

  constructor() {
    const {
      address,
      publicKey,
      privateKey
    } = generateWallet();

    this.username = 'Genesis';
    this.address = address;
    this.publicKey = publicKey;
    this.privateKey = privateKey;

    // genesis UTXO
    // create random txid hash
    const hash = createHash('sha256');
    const txid = hash.update('').digest('hex');
    this.UTXO = new TXOutput(txid, this.address, 21);
  }

  balance() {
    return this.UTXO.value;
  }

  // builds a transaction
  deposit(address: string, value: number) {
    // 1 input which is current UTXO
    const inputTXID = this.UTXO.txid;
    // 2 outputs: to user and back to Genesis

    // hash the input tx hash with the recipient address
    const hashFunction1 = createHash('sha256');
    hashFunction1.update(inputTXID);
    hashFunction1.update(address);
    const midHash = hashFunction1.digest('hex');

    // sign the hash
    const sign = createSign('sha256');
    sign.update(midHash);
    sign.end();
    const sig = sign.sign(this.privateKey, 'hex');

    // hash signature to convert into TXID format
    const hashFunction2 = createHash('sha256');
    const outputTXID = hashFunction2.update(sig).digest('hex');

    // update UTXO pointer
  }
}

export default Genesis;
