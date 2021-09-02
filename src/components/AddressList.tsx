import { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  addressList: string[];
}

const Wrap = styled.div`
  word-wrap: break-word;
`;

const Space = styled.div`
  height: 10px;
`;

const AddressList = (props: Props): ReactElement => {
  const { addressList } = props;

  return (
    <div>
      <h4>Address List:</h4>
      {addressList.map((address) => {
        return (
          <div key={address}>
            <Wrap>{address}</Wrap>
            <Space></Space>
          </div>
        );
      })}
    </div>
  )
};

export default AddressList;
