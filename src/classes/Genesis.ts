import { createHash, createSign } from 'crypto';
import { generateWallet } from '../functions';
import { TXInput, TXOutput, Transaction } from './';

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

    // build the inputs - in this case, just the 1 input which is current UTXO
    const inputTXID = this.UTXO.txid; // not going to need this
    const inputs = [new TXInput(this.UTXO)];
    // 2 outputs: to user and back to Genesis

    // hash the inputs - in our case only one, but must follow the protocol
    const inputHashFunction = createHash('sha256');
    inputHashFunction.update(inputTXID);
    const inputHash = inputHashFunction.digest('hex');

    // hash the input hash with the recipient address
    const midHashFunction1 = createHash('sha256');
    midHashFunction1.update(inputHash);
    midHashFunction1.update(address);
    const midHash1 = midHashFunction1.digest('hex');

    // sign the hash
    const signFunction1 = createSign('sha256');
    signFunction1.update(midHash1);
    signFunction1.end();
    const sigToUser = signFunction1.sign(this.privateKey, 'hex');

    // hash signature to convert into TXID format
    const outputHashFunction1 = createHash('sha256');
    const outputUserTXID = outputHashFunction1.update(sigToUser).digest('hex');

    // now repeat the process with the Genesis address for the second UTXO
    const midHashFunction2 = createHash('sha256');
    midHashFunction2.update(inputHash);
    midHashFunction2.update(this.address);
    const midHash2 = midHashFunction2.digest('hex');
    const signFunction2 = createSign('sha256');
    signFunction2.update(midHash2);
    signFunction2.end();
    const sigToGen = signFunction2.sign(this.privateKey, 'hex');
    const outputHashFunction2 = createHash('sha256');
    const outputGenesisTXID = outputHashFunction2.update(sigToGen).digest('hex');

    // create the two UTXOs
    const userUTXO = new TXOutput(outputUserTXID, address, sigToUser, value);
    const newGenesisUTXO = new TXOutput(
      outputGenesisTXID,
      this.address,
      sigToGen,
      this.balance() - value
    );

    // create the transaction
    const transaction = new Transaction();
    transaction.inputs = inputs;
    transaction.outputs.push(userUTXO, newGenesisUTXO);

    // sign own address and attach pubkey and sig to transaction for verification
    transaction.publicKey = this.publicKey;
    const signTransaction = createSign('sha256');
    signTransaction.update(this.address);
    signTransaction.end();
    transaction.signature = signTransaction.sign(this.privateKey, 'hex');

    // update UTXO pointer
    this.UTXO = newGenesisUTXO;

    // return the transaction so it can be added to the state
    return transaction;
  }
}

export default Genesis;
