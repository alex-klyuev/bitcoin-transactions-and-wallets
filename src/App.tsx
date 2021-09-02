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
import { Transaction, Genesis, Queue } from './classes';
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
  UTXOSetByTXID: UTXOSet;

  // usually, it would be the wallet's job to manage that user's
  // UTXO state in a separate application. However, for this
  // application I'll have a separate set that indexes by
  // address for quick lookup by the wallet components
  // addresses may have multiple UTXOs which will be stored
  // in a queue (just for fun)
  UTXOSetByAddress: {
    [index: string]: {
      [index: string]: UTXOSet
    }
  };
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    // create instance of Genesis and the genesisUTXO
    const genesis = new Genesis();
    const genesisUTXO = genesis.UTXO;
    const UTXOSetByTXID: UTXOSet = {};
    UTXOSetByTXID[genesisUTXO.txid] = genesisUTXO;
    const UTXOSetByAddress: State['UTXOSetByAddress'] = {};
    UTXOSetByAddress[genesisUTXO.address] = new Queue();
    UTXOSetByAddress[genesisUTXO.address].enqueue(genesisUTXO);

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
      UTXOSetByTXID,
      UTXOSetByAddress
    }

    this.createNewWallet = this.createNewWallet.bind(this);
  }

  // handler for when user creates new wallet
  // form validates so this is only called with valid inputs
  createNewWallet(username: string, deposit: number): void {
    const {
      walletTracker,
      addressList,
      UTXOSetByAddress,
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

    // add address to list and UTXOSetByAddress
    addressList.push(address);
    UTXOSetByAddress[address] = new Queue();

    // have genesis deposit the target funds
    if (deposit > 0) {
      const transaction = genesis.deposit(address, deposit);
      this.verifyAndAddTransaction(transaction);
    }

    this.setState({
      walletTracker: { ...walletTracker },
      addressList: [...addressList],
      UTXOSetByAddress: { ...UTXOSetByAddress }
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
    const { UTXOSetByTXID } = this.state;
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
      if (!UTXOSetByTXID[txid] || UTXOTracker.has(txid)) return false;

      // if not, add to the tracker and grab the UTXO for further verification
      UTXOTracker.add(txid);
      const UTXO = UTXOSetByTXID[txid];

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
      const outputHashFunction = createHash('sha256');
      const outputHash = outputHashFunction.update(sig).digest('hex');
      // verify that we arrive at the same final hash
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
    let {
      UTXOSetByTXID,
      UTXOSetByAddress,
      transactions
    } = this.state;
    // remove inputs from UTXOset
    transaction.inputs.forEach((input) => {
      delete UTXOSetByTXID[input.txid];
      delete UTXOSetByAddress[UTXOSetByTXID[input.address];
    });
    // add outputs to UTXOset
    transaction.outputs.forEach((output) => {
      UTXOSetByTXID[output.txid] = output;
      UTXOSetByAddress[output.address] = output;
    });

    // add tx to all tx list
    transactions.push(transaction);
    this.setState({
      UTXOSetByTXID: { ...UTXOSetByTXID },
      transactions: [...transactions]
    });
  }

  render() {
    const {
      walletTracker,
      addressList,
      genesis,
      UTXOSetByAddress
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
            return <Wallet
              key={address}
              wallet={wallet}
              UTXOSet={UTXOSetByAddress}
            />
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
