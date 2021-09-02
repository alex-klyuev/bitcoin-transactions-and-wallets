import { ReactElement } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin: 0 10px;
`;

const Wrap = styled.div`
  word-wrap: break-word;
`;

const Space = styled.div`
  height: 10px;
`;

interface Props {
  addressList: Set<string>;
}

const AddressList = (props: Props): ReactElement => {
  const { addressList } = props;
  const addressListArray = Array.from(addressList);

  return (
    <Container>
      <h4>Address List:</h4>
      {addressListArray.map((address) => {
        return (
          <div key={address}>
            <Wrap>{address}</Wrap>
            <Space></Space>
          </div>
        );
      })}
    </Container>
  )
};

export default AddressList;
