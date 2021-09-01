import TXInput from "./TXInput";
import TXOutput from "./TXOutput";

interface Transaction {
  inputs: TXInput[];
  outputs: TXOutput[];
}

class TransactionChain {
  transactions: Transaction[];
  UTXOSet: TXOutput[];
  constructor() {
    this.transactions = [];
    this.UTXOSet = [];
  }
}

export default TransactionChain;
