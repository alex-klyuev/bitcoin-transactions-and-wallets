import { FormEvent, useState, ReactElement, Dispatch, SetStateAction } from "react";

interface Props {
  createNewWallet: (username: string, deposit:number) => void;
  availBal: number;
}

interface SetValues {
  [index: string]: Dispatch<SetStateAction<string>>;
}

const NewWalletForm = (props: Props): ReactElement => {
  const { createNewWallet, availBal } = props;
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

  const validateDeposit = (deposit: number): [boolean, number?] => {
    // check that deposit is a positive number or 0
    if (isNaN(deposit) || deposit < 0 || deposit % 1 !== 0) return [false, 0];
    // check that deposit is less than or equal to the amount left in genesis
    if (deposit > availBal) return [false, 1];
    return [true];
  };

  const onSubmit = () => {
    if (!validateUsername(username)) {
      alert('Enter a username');
      return;
    }

    const numDep = Number(deposit);
    const [isValid, errCode] = validateDeposit(numDep);
    if (!isValid && errCode === 0) {
      alert('Enter a positive integer or 0 for your deposit');
      return;
    }
    if (!isValid && errCode === 1) {
      alert('Deposit must be less than or equal to remainder in Genesis');
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
