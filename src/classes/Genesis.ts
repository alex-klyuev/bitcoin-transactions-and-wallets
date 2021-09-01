import { createHash } from 'crypto';
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

  deposit(address: string, value: number) {

  }
}

export default Genesis;
