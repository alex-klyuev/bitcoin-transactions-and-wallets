import { createHash } from 'crypto';
import generateWallet from './generateWallet';
import TXOutput from '../classes/TXOutput';

interface WalletTracker {
  [index: string]: {
    username: string;
    pubKey: string;
    privKey: string;
  }
}

interface Genesis {
  initWalletTracker: WalletTracker;
  initAddressList: string[];
  genesisUTXO: TXOutput;
}

const createGenesis = (): Genesis => {

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
};

export default createGenesis;
