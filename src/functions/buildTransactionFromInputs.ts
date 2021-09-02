import { createHash, createSign } from "crypto";
import { Transaction, TXOutput } from "../classes";

const buildTransactionFromInputs = (
  inputs: [TXOutput],
  senderAddress: string,
  senderPrivateKey: string,
  senderPublicKey: string,
  recipientAddress: string,
  value: number
) => {
  // hash the inputs and compute total input val
  let inputVal = 0;
  const inputHashFunction = createHash('sha256');
  inputs.forEach((input) => {
    inputVal += input.value;
    inputHashFunction.update(input.txid);
  });
  const inputHash = inputHashFunction.digest('hex');

  // hash the input hash with the recipient address
  const midHashFunction1 = createHash('sha256');
  midHashFunction1.update(inputHash);
  midHashFunction1.update(recipientAddress);
  const midHash1 = midHashFunction1.digest('hex');

  // sign the hash
  const signFunction1 = createSign('sha256');
  signFunction1.update(midHash1);
  signFunction1.end();
  const sigToUser = signFunction1.sign(senderPrivateKey, 'hex');

  // hash signature to convert into TXID format
  const outputHashFunction1 = createHash('sha256');
  const outputUserTXID = outputHashFunction1.update(sigToUser).digest('hex');

  // now repeat the process with the sender's address for the change UTXO
  const midHashFunction2 = createHash('sha256');
  midHashFunction2.update(inputHash);
  midHashFunction2.update(senderAddress);
  const midHash2 = midHashFunction2.digest('hex');
  const signFunction2 = createSign('sha256');
  signFunction2.update(midHash2);
  signFunction2.end();
  const sigToGen = signFunction2.sign(senderPrivateKey, 'hex');
  const outputHashFunction2 = createHash('sha256');
  const outputGenesisTXID = outputHashFunction2.update(sigToGen).digest('hex');

  // create the two UTXOs
  const userUTXO = new TXOutput(
    outputUserTXID,
    recipientAddress,
    sigToUser,
    value
  );
  const newGenesisUTXO = new TXOutput(
    outputGenesisTXID,
    senderAddress,
    sigToGen,
    inputVal - value
  );

  // create the transaction
  const transaction = new Transaction();
  transaction.inputs = inputs;
  transaction.outputs.push(userUTXO, newGenesisUTXO);

  // sign own address and attach pubkey and sig to transaction for verification
  transaction.publicKey = senderPublicKey;
  const signTransaction = createSign('sha256');
  signTransaction.update(senderAddress);
  signTransaction.end();
  transaction.signature = signTransaction.sign(senderPrivateKey, 'hex');
};

export default buildTransactionFromInputs;
