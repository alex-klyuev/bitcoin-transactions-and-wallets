class TXOutput {
  txid: string;
  address: string;
  sig: string;
  value: number;
  constructor(txid: string, address: string, sig:string, value: number) {
    this.txid = txid;
    this.address = address;
    this.sig = sig;
    this.value = value;
  }
}

export default TXOutput;
