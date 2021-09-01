import { FormEvent, useState, ReactElement, Dispatch, SetStateAction } from "react";

interface Props {
  createNewWallet: (username: string, deposit:number) => void;
}

interface SetValues {
  [index: string]: Dispatch<SetStateAction<string>>
}

const NewWalletForm = (props: Props): ReactElement => {
  const { createNewWallet } = props;
  const [username, setUsername] = useState('');
  const [deposit, setDeposit] = useState('');
  const setValues: SetValues = {
    username: setUsername,
    deposit: setDeposit
  }

  const onChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    setValues[target.id](target.value);
  };

  const validateUsername = (username: string): boolean => {
    if (username === '') return false;
    return true;
  }

  const validateDeposit = (deposit: number): boolean => {
    if (isNaN(deposit) || deposit <= 0) return false;
    // add validation for genesis total amount
    return true;
  };

  const onSubmit = () => {
    if (!validateUsername(username)) {
      alert('Enter a username');
      return;
    }

    const numDep = Number(deposit);
    if (!validateDeposit(numDep)) {
      alert('Enter a positive number for your deposit');
      return;
    }

    createNewWallet(username, numDep);
  };

  return (
    <div>
      <h4>Create New Wallet:</h4>
      <div>Enter Username</div>
      <input
        id='username'
        value={username}
        onChange={onChange}
      />
      <div>Deposit amount</div>
      <input
        id='deposit'
        value={deposit}
        onChange={onChange}
      />
      <div>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default NewWalletForm;
