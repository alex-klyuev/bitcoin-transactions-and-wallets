import { ReactElement } from "react";
import Genesis from "../classes/Genesis";

interface Props {
  genesis: Genesis
}

const GenesisView = (props: Props): ReactElement => {
  const { genesis } = props;
  const { username, address } = genesis;
  const balance = genesis.balance();

  return (
    <div>
      <h4>{username}</h4>
      <div>Address: {address}</div>
      <div>Balance: {balance}</div>
    </div>
  );
};

export default GenesisView;