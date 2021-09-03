# bitcoin-transactions-and-wallets

Educational project for me to learn about how the Bitcoin network models transactions and how users can send/receive transactions and view their balances (known commonly as "wallets").

This is not designed with security in mind, but rather to understand the design principles behind Bitcoin.

Technical concepts: hashing, cryptography

## Overview

In the Bitcoin network, "coins" are defined as transactions; in other words, balances only actually exist within transactions.

Transactions have inputs and outputs. Unspent transaction outputs (UTXO's) represent existing user balances.

Transactions are chained together similar to blocks, using hashing and public-key cryptography.

Transaction outputs become inputs in following transactions. An owner of a UTXO can "unlock" it via their keys, and build a transaction to any other address on the network.

<i>Each output can only be used as an input once.</i> This is verified by the consensus network / miners, which is out of scope for this project.

## Interface

Barebones React app to allow users to create wallets, view balances, and send/receive BTC.

Upon page load or refresh, a new chain with no wallets or transaction history is created.

User will be able to create new wallets, send money from address to address, and see the transaction chain.

## Usage
npm install

npm start

## Implementation Details

### Genesis and Wallet Creation

Upon startup a wallet named "Genesis" is created, along with the "Genesis UTXO" which has 21M BTC.

A new wallet can "deposit" some money, which will result in Genesis sending that wallet that amount.

In this way all transactions are chained from the Genesis UTXO.
Wallets can send funds to other wallets but not back to Genesis.

### Building and Verifying a Transaction

To build a transaction, a user selects UTXO's that belong to it and uses them as "inputs" for the transaction.

In Bitcoin, they could use these inputs to create as many outputs as they like to various addresses.

In this implementation, the user can select only one address to send to.

If the input value is greater than the target transaction value, a "change output" is created back to the sender's address.

In this way, all transactions are build from a chain of inputs that can be traced back to the Genesis UTXO.

The purpose of this is to create a <i>unique, verifiable, irreversible chain of transactions</i> that holds all the transaction history of the network.

Users can thereby trust the authenticity of the network because they are able to verify it themselves.

### Transaction Structure

```yaml
Transaction: {
  Sender Public Key: used to verify transaction,
  Signature: sender signature used to verify ownership of transaction inputs,
  Inputs: [{
    Txid: unique TX identifier/hash (explained below),
  }],
  Outputs: [{
    Txid: all inputs are hashed with recipient address and signed by sender private key,
    Signature: sender signature authorizing this transaction output,
    Recipient Address: hash of recipient public key,
    Value: BTC amount
  }]
}
```

UTXOs are unspent transaction outputs, and are also referenced from user wallet software.

### Verification

There are two components to a transactoin that must be verified by the chain:
1. Users who want to use UTXO's as inputs to transactions actually own those UTXOs
2. Transactions are sent by who they are claimed to be sent by

### UTXO
In Bitcoin, this is accomplished via a locking/unlocking script, which is modeled by a Turing-incomplete scripting language.

I adopted a simpler approach in this implementation: a user claiming a UTXO must present their public key and digitally sign their address.

The chain verifies that the public key indeed corresponds to that address (the address is simply a hash of the public key) and verifies the signature.

## Transaction Authenticity
More similar to the Bitcoin implementation, a Bitcoin sender hashes together the input transaction hashes, the recipient's address, and digitally signs it. This can similarly be verified by anyone by using the sender's public key.

## Libraries
create-react-app

Nodejs crypto module

key-encoder

styled-components

## References
https://github.com/bitcoinbook/bitcoinbook, especially Chapters 4 and 6
https://developer.bitcoin.org/devguide/block_chain.html
https://bitcoin.org/bitcoin.pdf