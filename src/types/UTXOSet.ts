import { TXOutput } from "../classes";

// index UTXO's by txid for quick lookup
interface UTXOSet {
  [index: string]: TXOutput;
}

export type { UTXOSet };
