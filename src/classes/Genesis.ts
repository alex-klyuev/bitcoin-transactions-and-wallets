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

  constructor() {
    /* const createGenesis = (): Genesis => {

      // genesis wallet info
      const initWalletTracker: WalletTracker = {};
      const initAddressList: string[] = [];
      const genesis = generateWallet();

      initWalletTracker[genesis.address] = {
        username: 'Genesis',
        pubKey: genesis.publicKey,
        privKey: genesis.privateKey
      };

      initAddressList.push(genesis.address);

      // genesis UTXO
      // create random txid hash
      const hash = createHash('sha256');
      const txid = hash.update('').digest('hex');
      const genesisUTXO = new TXOutput(txid, genesis.address, 21);

      return {
        initWalletTracker,
        initAddressList,
        genesisUTXO
      };
    }; */
  }
}

export default Genesis;
