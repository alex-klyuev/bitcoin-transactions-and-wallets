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

const Blue = styled.div`
  word-wrap: break-word;
  padding: 0 10px;
  color: blue;
`;

const Green = styled.div`
  color: darkgreen;
  font-weight: bold;
`;

const Bold = styled.div`
  font-weight: bold;
  color: darkred;
`;

interface Props {
  txid: string;
  value: number;
  address?: string;
  index?: number;
}

const TXBlock = (props: Props): ReactElement => {
  const {
    txid,
    value,
    address,
    index
  } = props;

  const renderOutputType = () => {
    if (index === 0) {
      return <Bold>Primary Output</Bold>
    }
    if (index === 1) {
      return <Bold>Change Output</Bold>
    }
    return null;
  }

  const renderAddress = () => {
    if (address) return (
      <div>
        <div>Recipient Address:</div>
        <Space></Space>
        <Wrap>{address}</Wrap>
        <Space></Space>
      </div>
    );
    return null;
  }

  return (
    <Container>
      {renderOutputType()}
      <Space></Space>
      <Green>Value: {value.toLocaleString()} BTC</Green>
      <Space></Space>
      <div>Transaction ID:</div>
      <Space></Space>
      <Blue>{txid}</Blue>
      <Space></Space>
      {renderAddress()}
    </Container>
  )
};

export default TXBlock;
