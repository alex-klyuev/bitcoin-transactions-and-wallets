import { ReactElement } from 'react';
import styled from 'styled-components';
// types
import { UTXOSet, Wallet } from '../types';

const Wrap = styled.div`
  word-wrap: break-word;
`;

const Space = styled.div`
  height: 10px;
`;

// Aim to recreate Bitcoin wallet software framework:
// must build transactions in their entirety and broadcast them
// to the network; transactions are either validated and added to chain
// or denied (no error messages provided)

// However, instead of making the wallet software find and manage its UTXOs
// as it would in reality, I have the chain pass down all UTXOs that
// belong to that address for the sake of efficiency

interface Props {
  wallet: Wallet;
  UTXOSet: UTXOSet
}

// This component should be created for every user that creates a wallet,
// allowing them to interface with their account
const UserWalletInterface = (props: Props): ReactElement => {
  const { wallet, UTXOSet } = props;
  const {
    address,
    username,
    publicKey,
    privateKey
  } = wallet;

  return (
    <div>
      <h4>{username}</h4>
      <Wrap>Address: {address}</Wrap>
      <Space></Space>
      <div>Balance:</div>
      {/* Send Money Form */}
    </div>
  );
};

export default UserWalletInterface;
