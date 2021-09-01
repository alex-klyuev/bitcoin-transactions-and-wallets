// addresses are stored as key values for quick lookup
interface WalletTracker {
  [index: string]: {
    username: string;
    publicKey: string;
    privateKey: string;
  }
}

export type { WalletTracker };
