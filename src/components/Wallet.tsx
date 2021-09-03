import { Dispatch, FormEvent, ReactElement, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { Transaction, TXOutput } from '../classes';
import { balance, findUTXOsForTransaction, buildTransactionFromUTXOs } from '../functions';
// types
import { UTXOSet, Wallet } from '../types';

const Container = styled.div`
  border-style: solid;
  padding: 5px;
  margin: 5px 0;
`;

const Wrap = styled.div`
  word-wrap: break-word;
`;

const Space = styled.div`
  height: 10px;
`;

// Aim to recreate Bitcoin wallet software framework
// 1. Has access to full UTXO Set, must do the work of identifying
// which UTXOs belong to it. This makes this app much less efficient
// since the Wallet doesn't actually manage its own state, but it'll
// stay truer to how the network functions
// 2. must build transactions in their entirety and broadcast them
// to the network; transactions are either validated and added to chain
// or denied (no error messages provided)

interface Props {
  wallet: Wallet;
  UTXOSet: UTXOSet;
  addressList: Set<string>;
  verifyAndAddTransaction: (transaction: Transaction) => boolean;
}

interface SetValues {
  [index: string]: Dispatch<SetStateAction<string>>;
}

// This component should be created for every user that creates a wallet,
// allowing them to interface with their account
const UserWalletInterface = (props: Props): ReactElement => {
  const {
    wallet,
    UTXOSet,
    addressList,
    verifyAndAddTransaction
  } = props;
  const {
    address,
    username,
    publicKey,
    privateKey
  } = wallet;

  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState('');
  const setValues: SetValues = {
    recipientAddress: setRecipientAddress,
    amount: setAmount
  }

  const onChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    setValues[target.id](target.value);
  };

  const validateAddress = () => {
    if (!addressList.has(recipientAddress)) return false;
    return true;
  };

  const validateAmount = (amount: number): boolean => {
    if (isNaN(amount) || amount <= 0 || amount % 1 !== 0) return false;
    return true;
  };

  const onSubmit = () => {
    // address would not be validated in reality, but we'll do it here
    if (!validateAddress())  {
      alert('Address not found');
      return;
    }
    // validate that amount is a positive integer
    const numAmt = Number(amount);
    if (!validateAmount(numAmt)) {
      alert('Enter a positive integer');
      return;
    }

    // once inputs are validated, build the and broadcast the transaction
    buildAndBroadcastTransaction(recipientAddress, numAmt);
  }

  const buildAndBroadcastTransaction = (recipientAddress: string, value: number) => {
    const [sufFunds, UTXOs] = findUTXOsForTransaction(address, value, UTXOSet);
    if (!sufFunds) {
      alert('Insufficient funds');
      return;
    }
    const inputUTXOs = UTXOs as TXOutput[];

    const transaction = buildTransactionFromUTXOs(
      inputUTXOs,
      address,
      privateKey,
      publicKey,
      recipientAddress,
      value
    );

    verifyAndAddTransaction(transaction);
  }

  return (
    <Container>
      <h4>Username: {username}</h4>
      <Wrap>Address: {address}</Wrap>
      <Space></Space>
      <div>Balance: {balance(address, UTXOSet)} BTC</div>
      <h4>Send Money:</h4>
      <div>Address</div>
      <input
        id='recipientAddress'
        value={recipientAddress}
        onChange={onChange}
      />
      <div>Amount</div>
      <input
        id='amount'
        value={amount}
        onChange={onChange}
      />
      <div>
        <button onClick={onSubmit}>Send!</button>
      </div>
    </Container>
  );
};

export default UserWalletInterface;
