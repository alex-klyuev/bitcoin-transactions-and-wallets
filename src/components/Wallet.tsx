import { ReactElement } from 'react';
// types
import { Wallet } from '../types';

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
      <div>Address: {address}</div>
      <div>Balance:</div>
      {/* Send Money Form */}
    </div>
  );
};

export default UserWalletInterface;
