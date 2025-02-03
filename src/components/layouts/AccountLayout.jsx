import { Outlet } from "react-router-dom";
import AccountNavBar from "../account/AccountNavBar";
import styled from "styled-components";

const AccountLayout = () => {
  return (
    <Container>
      <AccountNavBar />
      <Outlet />
    </Container>
  );
};

export default AccountLayout;

const Container = styled.div`
  display: grid;
  grid-template-columns: 184px minmax(10px, 1fr);
  column-gap: 40px;
  margin-top: 48px;
`;
