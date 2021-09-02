import { ReactElement } from 'react';
import styled from 'styled-components';
// types
import { Wallet } from '../types';

const Wrap = styled.div`
  word-wrap: break-word;
`;

const Space = styled.div`
  height: 10px;
`;


interface Props {
  wallet: Wallet;
}

// This component should be created for every user that creates a wallet,
// allowing them to interface with their account
const UserWalletInterface = (props: Props): ReactElement => {
  const {
    address,
    username,
    publicKey,
    privateKey
  } = props.wallet;

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
