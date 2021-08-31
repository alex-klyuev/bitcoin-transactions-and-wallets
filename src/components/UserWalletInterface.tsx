import { ReactElement } from 'react';

interface Props {
  wallet: {
    address: string;
    username: string;
    pubKey: string;
    privKey: string;
  }
}

// This component should be created for every user that creates a wallet,
// allowing them to interface with their account
const UserWalletInterface = (props: Props): ReactElement => {
  const {
    address,
    username,
    pubKey,
    privKey
  } = props.wallet;

  return (
    <div>
      <h4>{username}</h4>
      <div>Address: {address.length}</div>
      <div>Balance:</div>
      {/* Send Money Form */}
    </div>
  );
};

export default UserWalletInterface;
