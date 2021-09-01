import { createHash } from 'crypto';
import generateWallet from '../functions/generateWallet';
import TXOutput from './TXOutput';
// types
import { WalletTracker } from '../types';

// Genesis is going to have similar functionality to a normal wallet,
// except it will lack a UI and have some extra functions.
// could be a good opportunity to reuse some functionality / use subclassing,
// but let's build out the functionality first
class Genesis {
  username: string;
  address: string;
  publicKey: string;
  privateKey: string;

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
  }

  initState() {
    // genesis wallet info
    const initWalletTracker: WalletTracker = {};
    const initAddressList: string[] = [];

    initWalletTracker[this.address] = {
      username: this.username,
      publicKey: this.publicKey,
      privateKey: this.privateKey
    };

    initAddressList.push(this.address);

    // genesis UTXO
    // create random txid hash
    const hash = createHash('sha256');
    const txid = hash.update('').digest('hex');
    const genesisUTXO = new TXOutput(txid, this.address, 21);

    return {
      initWalletTracker,
      initAddressList,
      genesisUTXO
    }
  }
}

export default Genesis;
