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

Transaction: {
  Inputs: [{
    Txid: hash/signature of this
  }]
}

### Verification

### Transaction Chain

This chain will be modeled as a Doubly Linked List in this implementation, while using hashing to create unique, irreversible, and verifiable transaction chains.

## Libraries
Nodejs crypto module
key-encoder