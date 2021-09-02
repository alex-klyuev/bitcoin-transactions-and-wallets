import TXOutput from "./TXOutput";

// outputs always become inputs, so we can reuse that information
// the only thing we actually need is the txid!
// the output is stored already in the UTXOSet, so that chain
// has all the information it needs to verify this transaction
// from the txid
class TXInput {
  txid: string;
  constructor(TXOutput: TXOutput) {
    this.txid = TXOutput.txid;
  }
}

export default TXInput;
