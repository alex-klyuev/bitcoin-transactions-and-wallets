import { TXInput, TXOutput } from './';

class Transaction {
  inputs: TXInput[];
  outputs: TXOutput[];
  constructor() {
    this.inputs = [];
    this.outputs = [];
  }
}

export default Transaction;
