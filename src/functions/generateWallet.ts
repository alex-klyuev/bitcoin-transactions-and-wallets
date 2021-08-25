import { generateKeyPairSync, createHash } from 'crypto';
import crypto from 'crypto';

console.log(crypto);

console.log('?', generateKeyPairSync);

interface Wallet {
  address: string;
  publicKey: string;
  privateKey: string;
}

const generateWallet = (): Wallet => {
  // generate EC public-private keys in pem format
  console.log('?', generateKeyPairSync);
  const {
    publicKey,
    privateKey
  } = generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'sec1',
      format: 'pem'
    }
  });

  // generate address by putting public key through sha256 hash function
  const hash = createHash('sha256');
  hash.update(publicKey);
  const address = hash.digest('hex');

  console.log(publicKey);

  return {
    address,
    publicKey,
    privateKey,
  };
}

export default generateWallet;
