import TXOutput from "./TXOutput";

// outputs always become inputs, so we can reuse that information
// in this implementation, the only change is that we swap the address for
// the public key, so that the transaction can be verified
class TXInput {
  txid: string;
  publicKey: string;
  value: number;
  constructor(TXOutput: TXOutput, publicKey: string) {
    this.txid = TXOutput.txid;
    this.value = TXOutput.value;
    this.publicKey = publicKey;
  }
}

export default TXInput;
