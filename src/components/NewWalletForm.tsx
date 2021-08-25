import { FormEvent, useState, ReactElement } from "react";

interface Props {
  createNewWallet: (username: string) => void;
}

const NewWalletForm = (props: Props): ReactElement => {
  const { createNewWallet } = props;
  const [value, setValue] = useState('');

  const onChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    setValue(target.value);
  };

  const onSubmit = () => {
    createNewWallet(value);
  };

  return (
    <div>
      <div>Create New Wallet</div>
      <div>Enter Username:</div>
      <input
        value={value}
        onChange={onChange}
      />
      <div>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default NewWalletForm;
