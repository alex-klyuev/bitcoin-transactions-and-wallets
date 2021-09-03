import { ReactElement } from 'react';
import { createHash } from 'crypto';
import styled from 'styled-components';
import { Transaction } from '../../classes';
import TXBlock from './TXBlock';

const Container = styled.div`
  display: flex;
`;

const Block = styled.div`
  width: 50%;
`;

const Green = styled.div`
  text-align: center;
  color: darkgreen;
  font-weight: bold;
`;

const Bold = styled.div`
  font-weight: bold;
  text-align: center;
`;

const Wrap = styled.div`
  word-wrap: break-word;
  padding: 0 10px;
`;

const Space = styled.div`
  height: 10px;
`;

interface Props {
  transaction: Transaction;
}

const TransactionView = (props: Props): ReactElement => {
  const { transaction } = props;
  const {
    inputs,
    outputs,
    publicKey
  } = transaction;
  const {
    value,
    address
  } = outputs[0];
  const recipientAddress = address;

  // in reality our block explorer would follow the txid back
  // to the previous tx and find the address, but we can
  // cheat because we have the public key
  const computeAddress = createHash('sha256');
  const senderAddress = computeAddress.update(publicKey).digest('hex');

  return (
    <div>
      <Green>Value: {value.toLocaleString()}</Green>
      <Container>
        <Block>
          <Bold>Sender:</Bold>
          <Space></Space>
          <Wrap>{senderAddress}</Wrap>
          <Space></Space>
          <Bold>Inputs</Bold>
          {inputs.map((input) => <TXBlock
            key={input.txid}
            txid={input.txid}
            value={input.value}
          />)}
        </Block>
        <Block>
          <Bold>Recipient:</Bold>
          <Space></Space>
          <Wrap>{recipientAddress}</Wrap>
          <Space></Space>
          <Bold>Outputs</Bold>
          {outputs.map((output, index) => <TXBlock
            key={output.txid}
            txid={output.txid}
            value={output.value}
            address={output.address}
            index={index}
          />)}
        </Block>
      </Container>
    </div>
  );
};

export default TransactionView;
