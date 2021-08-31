import { ReactElement } from "react";

interface Props {
  addressList: string[];
}

const AddressList = (props: Props): ReactElement => {
  const { addressList } = props;

  return (
    <div>
      <h4>Address List:</h4>
      {addressList.map((address) => <div key={address}>{address}</div>)}
    </div>
  )
};

export default AddressList;
