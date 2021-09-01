import TXInput from "./TXInput";
import TXOutput from "./TXOutput";

interface Transaction {
  inputs: TXInput[];
  outputs: TXOutput[];
}

class TransactionChain {
  transactions: Transaction[];
  constructor() {
    this.transactions = [];
  }

}

export default TransactionChain;
