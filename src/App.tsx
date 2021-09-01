// lib
import { ReactElement, useState } from 'react';
// components
import NewWalletForm from './components/NewWalletForm';
import UserWalletInterface from './components/UserWalletInterface';
import AddressList from './components/AddressList';
// functions
import generateWallet from './functions/generateWallet';
import createGenesis from './functions/createGenesis';

// addresses are stored as key values for quick lookup
interface WalletTracker {
  [index: string]: {
    username: string;
    pubKey: string;
    privKey: string;
  }
}

// generate Genesis Wallet once upon start
const {
  initWalletTracker,
  initAddressList,
  genesisUTXO
} = createGenesis();

const App = (): ReactElement => {
  // state management

  // in our top level component, we want to hold reference to all wallets
  // and their associated addresses and key pairs.
  // in reality, the private key would be securely stored by the user,
  // but we'll keep it here to start for the purposes of simulating the
  // Bitcoin transaction verification and chaining design at a high level
  const [walletTracker, setWalletTracker] = useState<WalletTracker>(initWalletTracker);
  const [addressList, setAddressList] = useState<string[]>(initAddressList);

  // handlers
  const createNewWallet = (username: string): void => {
    // generate pub-priv key pair and address
    const {
      address,
      publicKey,
      privateKey
    } = generateWallet();

    // add to wallet tracker

    walletTracker[address] = {
      username,
      pubKey: publicKey,
      privKey: privateKey
    }
    setWalletTracker({ ...walletTracker });

    // add address to list
    addressList.push(address);
    setAddressList([...addressList]);
  };

  return (
    <div>
      <NewWalletForm createNewWallet={createNewWallet} />
      {addressList.map((address) => {
        const wallet = {
          address,
          ...walletTracker[address]
        };
        return < UserWalletInterface key={address} wallet={wallet} />
      })}
      <AddressList addressList={addressList} />
    </div>
  );
};

export default App;
