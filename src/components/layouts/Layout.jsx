import { Outlet } from "react-router-dom";
import Header from "@/components/layouts/Header";
import styled from "styled-components";
import SideBar from "@/components/layouts/SideBar";
import SlidingPanel from "@/components/layouts/SlidingPanel";
import { useState } from "react";

const Layout = () => {
  const [sideCartegory, setSideCartegory] = useState("");

  return (
    <Container>
      <ContentContainer $sideCartegory={sideCartegory}>
        <HeaderContainer $sideCartegory={sideCartegory}>
          <Header />
        </HeaderContainer>
        <MainContainer>
          <Outlet />
        </MainContainer>
      </ContentContainer>
      <SlidingPanel sideCartegory={sideCartegory} />
      <SideBarContainer>
        <SideBar
          sideCartegory={sideCartegory}
          setSideCartegory={setSideCartegory}
        />
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
  width: ${({ $sideCartegory }) =>
    $sideCartegory !== "" ? "calc(100% - 370px)" : "calc(100% - 56px)"};
  height: 100vh;
  transition: 0.2s ease-in-out;
`;

const HeaderContainer = styled.header`
  position: fixed;
  margin: auto;
  top: 0;
  width: ${({ $sideCartegory }) =>
    $sideCartegory !== "" ? "calc(100% - 370px)" : "calc(100% - 56px)"};
  min-width: 1000px;
  padding-right: 20px;
  background: white;
  z-index: 1000;
  transition: 0.2s ease-in-out;
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  min-width: 1000px;
  padding-right: 20px;
  margin: 60px auto 0 auto;
`;

const SideBarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
`;
