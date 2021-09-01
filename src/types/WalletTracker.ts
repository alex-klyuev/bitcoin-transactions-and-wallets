// addresses are stored as key values for quick lookup
interface WalletTracker {
  [index: string]: {
    username: string;
    pubKey: string;
    privKey: string;
  }
}

export type { WalletTracker };
