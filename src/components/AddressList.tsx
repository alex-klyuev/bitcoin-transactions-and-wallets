import { ReactElement } from "react";

interface Props {
  wallets: {
    [index: string]: {
      username: string;
      pubKey: string;
      privKey: string;
    }
  }
}

const AddressList = (props: Props): ReactElement => {
  const { wallets } = props;

  return (
    <div>
      {wallets.map((wallet) => <div>{/* how to store data? */}</div>)}
    </div>
  )
};

export default AddressList;
