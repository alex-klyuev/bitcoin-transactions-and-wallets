# bitcoin-transactions-and-wallets

Educational project for me to learn about how the Bitcoin network models transactions and user balances ("wallets").

This is not designed with security in mind, but rather to understand the design principles behind Bitcoin.

Technical concepts: hashing, cryptography

## Overview

In the Bitcoin network, "coins" are defined as transactions; in other words, balances only actually exist within transactions.

Transactions have inputs and outputs. Unspent transaction outputs (UTXO's) represent existing user balances.

Transactions are chained together similar to blocks, using hashing and public-key cryptography.

Transaction outputs become inputs in following transactions. An owner of a UTXO can "unlock" it via their keys, and build a transaction to any other address on the network.

<i>Each output can only be used as an input once.</i> This is verified by the consensus network / miners, which is out of scope for this project.

## Interface

I will design a barebones React app to play with the app.
A new chain with empty wallets and transactions will be created on startup (unless I add data persistence).
User will be able to create new wallets, send money from address to address, and see the transaction chain.

## Implementation Details

### Transaction Structure

```yaml
Transaction: {
  Inputs: [{
    Txid: hash of this transaction input (see below),
    Sender Public Key: anyone can use this key to verify
      1. ownership of this UTXO
      2. authenticity of this transaction,
    Value: BTC amount
  }],
  Outputs: [{
    Txid: all inputs are hashed with recipient address and signed by sender private key,
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
I adopted a simpler approach in this implementation: a user claiming a UTXO must present their public key and digitally sign their address. The chain verifies that the public key indeed corresponds to that address (the address is simply a hash of the public key) and verifies the signature.

## Transaction Authenticity
More similar to the Bitcoin implementation, a Bitcoin sender hashes together the input transaction hashes, the recipient's address, and digitally signs it. This can similarly be verified by anyone by using the sender's public key.

## Libraries
create-react-app
<br>
Nodejs crypto module
<br>
key-encoder
<br>
styled-components

## Usage
npm install
<br>
npm start

## References
https://github.com/bitcoinbook/bitcoinbook, especially Chapters 4 and 6
https://developer.bitcoin.org/devguide/block_chain.html
https://bitcoin.org/bitcoin.pdf