import { ReactElement } from "react";
import styled from 'styled-components';
import Genesis from '../classes/Genesis';

const Wrap = styled.div`
  word-wrap: break-word;
`;

const Space = styled.div`
  height: 10px;
`;

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
      <Wrap>Address: {address}</Wrap>
      <Space></Space>
      <div>Balance: {balance}</div>
    </div>
  );
};

export default GenesisView;