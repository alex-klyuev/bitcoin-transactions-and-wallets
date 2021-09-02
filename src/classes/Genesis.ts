import { createHash, createSign } from 'crypto';
import { buildTransactionFromUTXOs, generateWallet } from '../functions';
import { TXOutput, Transaction } from './';

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
    const txid = hash.update(Math.random().toString()).digest('hex');
    const sign = createSign('sha256');
    sign.update(txid);
    sign.end();
    const sig = sign.sign(this.privateKey, 'hex');
    this.UTXO = new TXOutput(txid, this.address, sig, 21000000);
  }

  balance(): number {
    return this.UTXO.value;
  }

  // builds a transaction
  deposit(address: string, value: number): Transaction {

    // provide the UTXOs for the transaction;
    // in this case, just the 1 input which is current UTXO
    const inputUTXOs = [this.UTXO];

    // 2 outputs: to user and back to Genesis
    const transaction = buildTransactionFromUTXOs(
      inputUTXOs,
      this.address,
      this.privateKey,
      this.publicKey,
      address,
      value
    )

    // update UTXO pointer
    // (might want to make this similar to normal wallet after
    //  adding that functionality)
    this.UTXO = transaction.outputs[1];

    // return the transaction so it can be added to the state
    return transaction;
  }
}

export default Genesis;
