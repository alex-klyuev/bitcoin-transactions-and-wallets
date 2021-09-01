class TXOutput {
  txid: string;
  address: string;
  value: number;
  constructor(txid: string, address: string, value: number) {
    this.txid = txid;
    this.address = address;
    this.value = value;
  }
}

export default TXOutput;
