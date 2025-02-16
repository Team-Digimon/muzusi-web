import AccountRecords from "@/components/account/AccountRecords";
import styled from "styled-components";

const Records = () => {
  return (
    <RecordsContainer>
      <AccountRecords />
    </RecordsContainer>
  );
};

export default Records;

const RecordsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
