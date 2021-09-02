// lib
import React from 'react';
import styled from 'styled-components';
import { createHash, createVerify } from 'crypto';
// components
import NewWalletForm from './components/NewWalletForm';
import GenesisView from './components/GenesisView';
import Wallet from './components/Wallet';
import AddressList from './components/AddressList';
// classes
import { TXInput, TXOutput, Transaction, Genesis } from './classes';
// functions
import generateWallet from './functions/generateWallet';
// types
import { UTXOSet, WalletTracker } from './types';


const Container = styled.div`
  display: flex;
`;

const Block = styled.div`
  width: 33vw;
`;

interface Props { }

interface State {
  genesis: Genesis;
  walletTracker: WalletTracker;
  addressList: string[];
  transactions: Transaction[];
  UTXOSet: UTXOSet;
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    // create instance of Genesis and the genesisUTXO
    const genesis = new Genesis();
    const genesisUTXO = genesis.UTXO;
    const UTXOSet: UTXOSet = {};
    UTXOSet[genesisUTXO.txid] = genesisUTXO;

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
      UTXOSet
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

    let {
      walletTracker,
      addressList,
      transactions
    } = this.state;
    const { genesis } = this.state;

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
    if (deposit > 0) {
      const transaction = genesis.deposit(address, deposit);

      // REFACTOR THIS TO VERIFY TRANSACTIONS

      transactions.push(transaction);
      transactions = [...transactions];
    }

    this.setState({
      walletTracker,
      addressList,
      transactions
    });
  };


  // handlers for verifying transactions
  // IMPORTANT: this function abstracts away the complexity performed by the
  // Bitcoin consensus & mining network; however, it performs a similar
  // function in terms of verifying that
  // 1. users have access to the UTXO they are claiming access to and
  // 2. verifying the identity of the senders (i.e., the transaction is not fraudulent)

  // these are done via cryptographic functions, in a similar mechanism to Bitcoin
  // The interaction b/n user and network is similar to Bitcoin as well:
  // the user/wallet "builds" and broadcasts the transaction, and the network verifies.
  // so the functionality to build a transaction is in the Wallet component;
  // the verification is here. if valid, the transaction is added to the chain of
  // valid transactions and updates the UTXO set, which is done in the following function

  // similar to Bitcoin (I think), there won't be any specific error codes:
  // the transaction is either accepted or declined in its entirety.
  // only once every aspect is verified do we update the UTXOSet
  verifyTransaction(transaction: Transaction): boolean {
    const { UTXOSet } = this.state;
    const {
      inputs,
      outputs,
      publicKey,
      signature
    } = transaction;

    // 1: Verify inputs. This is done in 2 parts:
    // a: verify that inputs are in the UTXO set (avoid double-spend)
    // b: verify that user has access to UTXOs as claimed
    // make sure user isn't trying to use same UTXO twice in one tx
    const UTXOTracker = new Set();

    // must confirm each input individually
    for (let i = 0; i < inputs.length; i++) {
      const { txid } = inputs[i];
      // a. verify that UTXO is in the set and isn't being reused
      if (!UTXOSet[txid] || UTXOTracker.has(txid)) return false;

      // if not, add to the tracker
      UTXOTracker.add(txid);

      // verify ownership of that UTXO
      // i. verify that user public key hashes to address
      const addressVerifyHash = createHash('sha256');
      const addressVerify = addressVerifyHash.update(publicKey).digest('hex');
      const UTXOAddress = UTXOSet[txid].address;
      const cond1 = addressVerify === UTXOAddress;

      // ii. verify that signature corresponds to the same public key
      // that forms the address
      const verify = createVerify('sha256');
      verify.update(UTXOAddress);
      verify.end();
      const cond2 = verify.verify(publicKey, signature, 'hex');
      if (!(cond1 && cond2)) return false;
    }

    return true;
  }

  addTransactionToChain(transaction: Transaction): void {

  }

  render() {
    const {
      walletTracker,
      addressList,
      genesis
    } = this.state;
    const { createNewWallet } = this;

    return (
      <Container>
        <Block>
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
        </Block>
        <Block>
          <AddressList addressList={addressList} />
        </Block>
        <Block>
          {/* Transactions View will go here */}
        </Block>
      </Container>
    );
  };
}

export default App;
