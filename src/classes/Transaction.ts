import TXInput from "./TXInput";
import TXOutput from "./TXOutput";

class Transaction {
  inputs: TXInput[];
  outputs: TXOutput[];
  constructor() {
    this.inputs = [];
    this.outputs = [];
  }
}

export default Transaction;
