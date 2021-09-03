import { createHash, createSign } from "crypto";
import { Transaction, TXInput, TXOutput } from "../classes";

const buildOutput = (
  inputHash: string,
  recipientAddress: string,
  outputIndex: number,
  senderPrivateKey: string,
  value: number
): TXOutput => {
  // hash the input hash with the recipient address
  const midHashFunction1 = createHash('sha256');
  midHashFunction1.update(inputHash);
  midHashFunction1.update(recipientAddress);
  const midHash1 = midHashFunction1.digest('hex');

  // sign the hash
  const signFunction1 = createSign('sha256');
  signFunction1.update(midHash1);
  signFunction1.end();
  const sigToRecipient = signFunction1.sign(senderPrivateKey, 'hex');

  // hash signature with output index
  // this serves two purposes: to convert into TXID format and to avoid
  // txid collisions when sending mulitple outputs to the same address
  // in our case we'll only have two output indices but this could easily
  // be extrapolated to multiple outputs
  const outputHashFunction1 = createHash('sha256');
  const outputRecipientTXID = outputHashFunction1
    .update(sigToRecipient)
    .update(outputIndex.toString())
    .digest('hex');

  // create UTXO and push to outputs
  const recipientUTXO = new TXOutput(
    outputRecipientTXID,
    recipientAddress,
    sigToRecipient,
    value
  );

  return recipientUTXO;
};

// this function will take an array of UTXOs that the user wants to
// use to build a transaction and return the transaction
const buildTransactionFromUTXOs = (
  inputUTXOs: TXOutput[],
  senderAddress: string,
  senderPrivateKey: string,
  senderPublicKey: string,
  recipientAddress: string,
  value: number
): Transaction => {
  // compute total input val, hash the inputs, and create TXInputs
  let inputVal = 0;
  const inputs: TXInput[] = [];
  const outputs: TXOutput[] = [];
  const inputHashFunction = createHash('sha256');
  inputUTXOs.forEach((inputUTXO) => {
    inputVal += inputUTXO.value;
    inputHashFunction.update(inputUTXO.txid);
    inputs.push(new TXInput(inputUTXO));
  });
  const inputHash = inputHashFunction.digest('hex');

  const recipientUTXO = buildOutput(
    inputHash,
    recipientAddress,
    0,
    senderPrivateKey,
    value
  );
  outputs.push(recipientUTXO);

  // now repeat the process with the sender's address for the change UTXO
  // first check if there's change remaining
  const change = inputVal - value;
  if (change > 0) {
    const changeUTXO = buildOutput(
      inputHash,
      senderAddress,
      1,
      senderPrivateKey,
      change
    );
    outputs.push(changeUTXO);
  }

  // create the transaction
  const transaction = new Transaction();
  transaction.inputs = inputs;
  transaction.outputs = outputs;

  // sign input hash to make a unique signature per transaction
  // and attach pubkey and sig to transaction for verification
  transaction.publicKey = senderPublicKey;
  const signTransaction = createSign('sha256');
  signTransaction.update(inputHash);
  signTransaction.end();
  transaction.signature = signTransaction.sign(senderPrivateKey, 'hex');

  return transaction;
};

export default buildTransactionFromUTXOs;
