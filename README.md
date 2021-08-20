# bitcoin-transactions-and-wallets

Educational project for me to learn about how the Bitcoin network models transactions and user balances ("wallets").

Technical concepts: hashing, cryptography

## Overview:

In the Bitcoin network, "coins" are defined as transactions; in other words, balances only actually exist within transactions.

Transactions have inputs and outputs. Unspent transaction outputs (UTXO's) represent existing user balances.

Transactions are chained together similar to blocks, using hashing and public-key cryptography.

This chain will be modeled as a Doubly Linked List in this implementation, while also using hashing.