import { TXInput, TXOutput } from './';

class Transaction {
  publicKey: string;
  signature: string;
  inputs: TXInput[];
  outputs: TXOutput[];
  constructor() {
    this.inputs = [];
    this.outputs = [];
    this.publicKey = '';
    this.signature = '';
  }
}

export default Transaction;
