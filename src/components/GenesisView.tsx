import { ReactElement } from "react";
import styled from 'styled-components';
import { Genesis } from '../classes';

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

interface Props {
  genesis: Genesis
}

const GenesisView = (props: Props): ReactElement => {
  const { genesis } = props;
  const { username, address } = genesis;
  const balance = genesis.balance();

  return (
    <Container>
      <h4>{username}</h4>
      <div> Don't send money to Genesis!</div>
      <Space></Space>
      <Wrap>Address: {address}</Wrap>
      <Space></Space>
      <div>Balance: {balance.toLocaleString()} BTC</div>
    </Container>
  );
};

export default GenesisView;