import { ReactElement } from "react";

interface Props {
  addressList: string[];
}

const AddressList = (props: Props): ReactElement => {
  const { addressList } = props;

  console.log(addressList);

  return (
    <div>
      <h4>Address List:</h4>
      {addressList.map((address) => <div>{address}</div>)}
    </div>
  )
};

export default AddressList;
