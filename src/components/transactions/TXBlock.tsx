import { ReactElement } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border-style: solid;
  padding: 5px;
  margin: 5px;
`;

const Wrap = styled.div`
  word-wrap: break-word;
  padding: 0 10px;
`;

const Space = styled.div`
  height: 10px;
`;

interface Props {
  txid: string;
  value: number;
  address?: string;
}

const TXBlock = (props: Props): ReactElement => {
  const {
    txid,
    value,
    address
  } = props;

  const renderAddress = () => {
    if (address) return (
      <div>
        <Space></Space>
        <Wrap>{address}</Wrap>
        <Space></Space>
      </div>
    );
    return null;
  }

  return (
    <Container>
      <div>Transaction ID:</div>
      <Space></Space>
      <Wrap>{txid}</Wrap>
      <Space></Space>
      <div>Value: {value} BTC</div>
      {renderAddress()}
    </Container>
  )
};

export default TXBlock;
