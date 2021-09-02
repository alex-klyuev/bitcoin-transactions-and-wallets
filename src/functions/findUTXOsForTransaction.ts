import { TXOutput } from "../classes";
import { UTXOSet } from "../types";

const findUTXOsForTransactions = (
  address: string,
  value: number,
  UTXOSet: UTXOSet
): [boolean, TXOutput[]?] => {
  // we want to search through all UTXOs and find those that belong to us
  // keep going until we find enough to cover the transaction value
  // or we find that there aren't enough funds
  let accruedVal = 0;
  const inputUTXOs: TXOutput[] = [];

  for (let key in UTXOSet) {
    // grab UTXO
    const UTXO = UTXOSet[key];
    // find our UTXOs
    if (UTXO.address === address) {
      // push to inputs
      inputUTXOs.push(UTXO);

      // check if there's enough value; if so, exit out of function
      accruedVal += UTXO.value;
      if (accruedVal >= value) return [true, inputUTXOs];
    }
  }

  // if we get through loop without finding enough funds, return false
  return [false];
};

export default findUTXOsForTransactions;