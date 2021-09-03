// lib
import React from 'react';
import styled from 'styled-components';
import { createHash, createVerify } from 'crypto';
// components
import NewWalletForm from './components/NewWalletForm';
import GenesisView from './components/GenesisView';
import Wallet from './components/Wallet';
import AddressList from './components/AddressList';
import TransactionsView from './components/TransactionsView';
// classes
import { Transaction, Genesis } from './classes';
// functions
import { generateWallet } from './functions';
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
  addressList: Set<string>;
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
      addressList: new Set(),

      // transaction chain manager
      // these properties simulate what the Bitcoin Network would keep
      // track of - all transactions in the network, and the UTXO set
      // In this app, the verification functionality of the consensus
      // network is abstracted away by the functionality of the App
      // component, but cryptographic verification of ownership is
      // still verified (move this comment to corresponding functions)
      transactions: [],
      UTXOSet,
    }

    this.createNewWallet = this.createNewWallet.bind(this);
    this.verifyAndAddTransaction = this.verifyAndAddTransaction.bind(this);
  }

  // handler for when user creates new wallet
  // form validates so this is only called with valid inputs
  createNewWallet(username: string, deposit: number): void {
    const {
      walletTracker,
      addressList,
      genesis
    } = this.state;

    // generate pub-priv key pair and address
    const {
      address,
      publicKey,
      privateKey
    } = generateWallet();

    // add to wallet tracker
    walletTracker[address] = {
      username,
      publicKey,
      privateKey
    };

    // add address to list
    addressList.add(address);

    // have genesis deposit the target funds
    if (deposit > 0) {
      const transaction = genesis.deposit(address, deposit);
      this.verifyAndAddTransaction(transaction);
    }

    this.setState({
      walletTracker: { ...walletTracker },
      addressList: (() => {
        // make a new set to trigger new state
        const newSet: Set<string> = new Set();
        addressList.forEach((address) => newSet.add(address))
        return newSet;
      })()
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
  verifyAndAddTransaction(transaction: Transaction): boolean {
    const { UTXOSet } = this.state;
    const {
      inputs,
      outputs,
      publicKey,
      signature
    } = transaction;
    let inputVal = 0;
    let outputVal = 0;

    // 1: Verify inputs
    //    a: verify that inputs are in the UTXO set (avoid double-spend)
    //    b: verify that user has access to UTXOs as claimed

    // make sure user isn't trying to use same UTXO twice in one tx
    const UTXOTracker: Set<string> = new Set();

    // must confirm each input individually
    for (let i = 0; i < inputs.length; i++) {
      const { txid } = inputs[i];
      // a. verify that UTXO is in the set and isn't being reused
      if (!UTXOSet[txid] || UTXOTracker.has(txid)) return false;

      // if not, add to the tracker and grab the UTXO for further verification
      UTXOTracker.add(txid);
      const UTXO = UTXOSet[txid];

      // verify ownership of that UTXO
      // i. verify that the user's public key hashes to the same address
      // as in the UTXO
      const addressVerifyHash = createHash('sha256');
      const addressVerify = addressVerifyHash.update(publicKey).digest('hex');
      const cond1 = addressVerify === UTXO.address;

      // ii. verify that signature corresponds to the same public key
      // that forms the address
      const verify = createVerify('sha256');
      verify.update(UTXO.address);
      verify.end();
      const cond2 = verify.verify(publicKey, signature, 'hex');
      if (!(cond1 && cond2)) return false;

      inputVal += UTXO.value;
    }

    // 2. Verify outputs
    //    a. verify hashes and signature of each output
    //    b. total value must be equal to or less than input total

    // first, must generate the hash of all the inputs
    // this is done by hashing the inputs in the order they appear (order matters)
    // this would be our "protocol" that all network participants would follow;
    // transaction builders and validators would validate hashes only if
    // hashed in the order they appear in the transaction
    const inputHashFunction = createHash('sha256');
    inputs.forEach((input) => inputHashFunction.update(input.txid));
    const inputHash = inputHashFunction.digest('hex');

    // in this app, users will only have 1-2 outputs per tx,
    // but in reality a user could make many outputs at once
    for (let i = 0; i < outputs.length; i++) {
      const {
        address,
        sig,
        txid,
        value
      } = outputs[i];
      // hash input hash with recipient address
      const midHashFunction = createHash('sha256');
      midHashFunction.update(inputHash);
      midHashFunction.update(address);
      const midHash = midHashFunction.digest('hex');
      const verify = createVerify('sha256');
      verify.update(midHash);
      verify.end();
      // verify the signature
      const cond1 = verify.verify(publicKey, sig, 'hex');
      // verify that we arrive at the same final hash
      const outputHashFunction = createHash('sha256');
      const outputHash = outputHashFunction
        .update(sig)
        .update(i.toString())
        .digest('hex');

      const cond2 = txid === outputHash;
      if (!(cond1 && cond2)) return false;
      outputVal += value;
    }

    if (outputVal > inputVal) return false;

    // once all has been verified, add Transaction to chain
    // then return true to the user
    this.addTransactionToChain(transaction);

    return true;
  }

  addTransactionToChain(transaction: Transaction): void {
    const {
      UTXOSet,
      transactions
    } = this.state;

    // remove inputs from UTXOset
    transaction.inputs.forEach((input) => {
      delete UTXOSet[input.txid];
    });
    // add outputs to UTXOset
    transaction.outputs.forEach((output) => {
      UTXOSet[output.txid] = output;
    });

    // add tx to all tx list
    transactions.push(transaction);
    this.setState({
      UTXOSet: { ...UTXOSet },
      transactions: [...transactions]
    });
  }

  render() {
    const {
      walletTracker,
      addressList,
      genesis,
      UTXOSet,
      transactions
    } = this.state;
    const { createNewWallet, verifyAndAddTransaction } = this;

    const addressListArray = Array.from(addressList);

    return (
      <Container>
        <Block>
          <NewWalletForm
            createNewWallet={createNewWallet}
            availBal={genesis.balance()}
          />
          <GenesisView genesis={genesis} />
          {addressListArray.map((address) => {
            const wallet = {
              address,
              ...walletTracker[address]
            };
            return <Wallet
              key={address}
              wallet={wallet}
              UTXOSet={UTXOSet}
              addressList={addressList}
              verifyAndAddTransaction={verifyAndAddTransaction}
            />
          })}
        </Block>
        <Block>
          <AddressList addressList={addressList} />
        </Block>
        <Block>
          <TransactionsView transactions={transactions} />
        </Block>
      </Container>
    );
  };
}

export default App;
