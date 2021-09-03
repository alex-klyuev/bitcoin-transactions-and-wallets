import { ReactElement } from "react";
import styled from "styled-components";
import { Transaction } from "../classes";
import TransactionView from "./transactions/TransactionView";

const OuterContainer = styled.div`
  margin: 0 10px;
`;

const TxContainer = styled.div`
  border-style: solid;
  padding: 5px;
  margin: 5px 0;
`;

interface Props {
  transactions: Transaction[];
}

const TransactionsView = (props: Props): ReactElement => {
  const { transactions } = props;

  const inverseTXs = transactions.slice().reverse();
  console.log(inverseTXs);

  return (
    <OuterContainer>
      <h4>Transactions:</h4>
      {inverseTXs.reverse().map((tx) => {
        return (
          <TxContainer key={tx.signature}>
            <TransactionView
              transaction={tx}
            />
          </TxContainer>
        );
      })}
    </OuterContainer>
  );
};

export default TransactionsView;
