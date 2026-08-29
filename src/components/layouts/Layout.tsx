import { Outlet } from "react-router-dom";
import Header from "@/components/layouts/Header";
import styled from "styled-components";
import SideBar from "@/components/layouts/SideBar";
import SlidingPanel from "@/components/layouts/SlidingPanel";
import { useState } from "react";

const Layout = () => {
  const [sideCategory, setSideCategory] = useState("");

  return (
    <Container>
      <ContentContainer $sideCategory={sideCategory}>
        <HeaderContainer $sideCategory={sideCategory}>
          <Header />
        </HeaderContainer>
        <MainContainer>
          <Outlet />
        </MainContainer>
      </ContentContainer>
      <SlidingPanel sideCategory={sideCategory} />
      <SideBarContainer>
        <SideBar
          sideCategory={sideCategory}
          setSideCategory={setSideCategory}
        />
      </SideBarContainer>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  display: flex;
`;

const ContentContainer = styled.div<{ $sideCategory: string }>`
  display: flex;
  flex-direction: column;
  width: ${({ $sideCategory }) =>
    $sideCategory !== "" ? "calc(100% - 370px)" : "calc(100% - 56px)"};
  height: 100vh;
  transition: 0.2s ease-in-out;
`;

const HeaderContainer = styled.header<{ $sideCategory: string }>`
  position: fixed;
  margin: auto;
  top: 0;
  width: ${({ $sideCategory }) =>
    $sideCategory !== "" ? "calc(100% - 370px)" : "calc(100% - 56px)"};
  min-width: 1000px;
  padding-right: 20px;
  background: white;
  z-index: 99;
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
  z-index: 100;
`;
