interface Wallet {
  username?: string;
  // 64 digit hex
  address: string;
  // pem encodings for the two keys for each of use in sign and verify functions
  publicKey: string;
  privateKey: string;
}

export type { Wallet };
