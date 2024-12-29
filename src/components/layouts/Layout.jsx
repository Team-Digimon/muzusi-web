import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";
import SideBar from "./SideBar";

const Layout = () => {
  return (
    <Container>
      <ContentContainer>
        <HeaderContainer>
          <Header />
        </HeaderContainer>
        <MainContainer>
          <Outlet />
        </MainContainer>
      </ContentContainer>
      <SideBarContainer>
        <SideBar />
      </SideBarContainer>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 56px);
  height: 100vh;
`;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: calc(100% - 65px);
  min-width: 1000px;
  background: white;
  z-index: 1000;
`;

const MainContainer = styled.div`
  padding: 0 40px;
  width: 100%;
  max-width: 1280px;
  margin: 60px auto 0 auto;
`;

const SideBarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1001;
`;
