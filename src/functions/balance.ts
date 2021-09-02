import { UTXOSet } from "../types";

const balance = (address: string, UTXOSet: UTXOSet): number => {
  let balance = 0;
  for (let key in UTXOSet) {
    // grab UTXO
    const UTXO = UTXOSet[key];
    // find our UTXOs
    if (UTXO.address === address) {
      balance += UTXO.value;
    }
  }
  return balance;
};

export default balance;
