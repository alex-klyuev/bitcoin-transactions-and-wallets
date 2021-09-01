// lib
import React from 'react';
// components
import NewWalletForm from './components/NewWalletForm';
import GenesisView from './components/GenesisView';
import Wallet from './components/Wallet';
import AddressList from './components/AddressList';
// classes
import TXInput from './classes/TXInput';
import TXOutput from './classes/TXOutput';
import Transaction from './classes/Transaction';
import Genesis from './classes/Genesis';
// functions
import generateWallet from './functions/generateWallet';
// types
import { WalletTracker } from './types';


interface Props { }

interface State {
  genesis: Genesis;
  walletTracker: WalletTracker;
  addressList: string[];
  transactions: Transaction[];
  UTXOSet: TXOutput[];
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    // create instance of Genesis and the genesisUTXO
    const genesis = new Genesis();
    const genesisUTXO = genesis.UTXO;

    // state management
    this.state = {
      genesis,

      // wallet and address manager
      // in our top level component, we want to hold reference to all wallets
      // and their associated addresses and key pairs.
      // in reality, the private key would be securely stored by the user,
      // but we'll keep it here to start for the purposes of simulating the
      // Bitcoin transaction verification and chaining design at a high level
      walletTracker: {},
      addressList: [],

      // transaction chain manager
      // these properties simulate what the Bitcoin Network would keep
      // track of - all transactions in the network, and the UTXO set
      // In this app, the verification functionality of the consensus
      // network is abstracted away by the functionality of the App
      // component, but cryptographic verification of ownership is
      // still verified (move this comment to corresponding functions)
      transactions: [],
      UTXOSet: [genesisUTXO],
    }

    this.createNewWallet = this.createNewWallet.bind(this);
  }

  // handler for when user creates new wallet
  // form validates so this is only called with valid inputs
  createNewWallet(username: string, deposit: number): void {
    // generate pub-priv key pair and address
    const {
      address,
      publicKey,
      privateKey
    } = generateWallet();

    let { walletTracker, addressList } = this.state;

    // add to wallet tracker
    walletTracker[address] = {
      username,
      publicKey,
      privateKey
    }
    walletTracker = { ...walletTracker };

    // add address to list
    addressList.push(address);
    addressList = [...addressList];

    // have genesis deposit the target funds

    this.setState({
      walletTracker,
      addressList
    });
  };

  render() {
    const {
      walletTracker,
      addressList,
      genesis
    } = this.state;
    const { createNewWallet } = this;

    return (
      <div>
        <NewWalletForm
          createNewWallet={createNewWallet}
          availBal={genesis.balance()}
        />
        <GenesisView genesis={genesis} />
        {addressList.map((address) => {
          const wallet = {
            address,
            ...walletTracker[address]
          };
          return <Wallet key={address} wallet={wallet} />
        })}
        <AddressList addressList={addressList} />
      </div >
    );
  };
}

export default App;
