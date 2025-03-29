import { Outlet } from "react-router-dom";
import AccountNavBar from "../account/AccountNavBar";
import styled from "styled-components";
import useAuth from "@/contexts/useAuth";
import MuLogo from "@/assets/logo/MuLogo.webp";

const AccountLayout = () => {
  const { user } = useAuth();

  return (
    <Container>
      <AccountNavBar />
      {user ? (
        <Outlet />
      ) : (
        <ErrorContainer>
          <Logo src={MuLogo} alt="MuLogo" />
          <ErrorDescription>로그인 후 이용해주세요.</ErrorDescription>
        </ErrorContainer>
      )}
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

const ErrorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
`;

const ErrorDescription = styled.div`
  font-size: 25px;
  font-weight: 600;
`;
