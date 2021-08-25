import React from 'react';
import NewWalletForm from './components/NewWalletForm';

const App = () => {
  // state management

  // in our top level component, we want to hold reference to all wallets
  // and their associated addresses and key pairs.
  // in reality, the private key would be securely stored by the user,
  // but we'll keep it here to start for the purposes of simulating the
  // Bitcoin transaction verification and chaining design at a high level

  // handlers
  const createNewWallet = () => {

  };

  return (
    <div>
      <NewWalletForm onSubmit={createNewWallet} />
    </div>
  );
}

export default App;
