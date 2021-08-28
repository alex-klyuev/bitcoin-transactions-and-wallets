import { ReactElement, useState } from 'react';
import NewWalletForm from './components/NewWalletForm';
import AddressList from './components/AddressList';
import generateWallet from './functions/generateWallet';

// addresses are stored as key values for quick lookup
interface WalletTracker {
  [index: string]: {
    username: string;
    pubKey: string;
    privKey: string;
  }
}

const App = (): ReactElement => {
  // state management

  // in our top level component, we want to hold reference to all wallets
  // and their associated addresses and key pairs.
  // in reality, the private key would be securely stored by the user,
  // but we'll keep it here to start for the purposes of simulating the
  // Bitcoin transaction verification and chaining design at a high level
  const [walletTracker, setWalletTracker] = useState<WalletTracker>({});

  // handlers
  const createNewWallet = (username: string): void => {
    // generate pub-priv key pair and address
    const {
      address,
      publicKey,
      privateKey
    } = generateWallet();

    const newWallet = {
      [address]: {
        username,
        pubKey: publicKey,
        privKey: privateKey
      }
    };

    // add to wallet tracker
    const updatedWalletTracker = {};
    Object.assign(updatedWalletTracker, walletTracker, newWallet);
    setWalletTracker(updatedWalletTracker);
  };

  return (
    <div>
      <NewWalletForm createNewWallet={createNewWallet} />
      <AddressList wallets={walletTracker} />
    </div>
  );
}

export default App;
