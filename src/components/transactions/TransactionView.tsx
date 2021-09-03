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

const Text = styled.div`
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
      <Text>Value: {value}</Text>
      <Container>
        <Block>
          <Text>Sender:</Text>
          <Space></Space>
          <Wrap>{senderAddress}</Wrap>
          <Space></Space>
          <Text>Inputs</Text>
          {inputs.map((input) => <TXBlock
            key={input.txid}
            txid={input.txid}
            value={input.value}
          />)}
        </Block>
        <Block>
          <Text>Recipient:</Text>
          <Space></Space>
          <Wrap>{recipientAddress}</Wrap>
          <Space></Space>
          <Text>Outputs</Text>
          {outputs.map((output) => <TXBlock
            key={output.txid}
            txid={output.txid}
            value={output.value}
            address={output.address}
          />)}
        </Block>
      </Container>
    </div>
  );
};

export default TransactionView;
