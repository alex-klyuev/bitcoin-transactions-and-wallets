import { createECDH, createHash } from 'crypto';
import KeyEncoder from 'key-encoder';
// types
import { Wallet } from '../types';

const generateWallet = (): Wallet => {
  // generate EC public-private keys in hex format
  // same cryptographic algorithm that Bitcoin uses
  const keyObject = createECDH('secp256k1');
  keyObject.generateKeys();
  const rawPrivateKey = keyObject.getPrivateKey('hex');
  const rawPublicKey = keyObject.getPublicKey('hex');

  // convert keys to pem format as signing and verifying functions
  // in node crypto module require pem
  const keyEncoder = new KeyEncoder('secp256k1');
  const privateKey = keyEncoder.encodePrivate(rawPrivateKey, 'raw', 'pem');
  const publicKey = keyEncoder.encodePublic(rawPublicKey, 'raw', 'pem');

  // generate address by putting public key through sha256 hash function
  const hash = createHash('sha256');
  hash.update(publicKey);
  const address = hash.digest('hex');

  return {
    address,
    publicKey,
    privateKey,
  };
}

export default generateWallet;
