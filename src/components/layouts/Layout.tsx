import { Outlet } from "react-router-dom";
import Header from "@/components/layouts/Header";
import styled from "styled-components";
import SideBar from "@/components/layouts/SideBar";
import SlidingPanel from "@/components/layouts/SlidingPanel";
import { Suspense, useState } from "react";
import Loading from "@/components/common/Loading";

const Layout = () => {
  const [sideCategory, setSideCategory] = useState("");

  return (
    <Container>
      <ContentContainer $sideCategory={sideCategory}>
        <HeaderContainer $sideCategory={sideCategory}>
          <Header sideCategory={sideCategory} />
        </HeaderContainer>
        <MainContainer $sideCategory={sideCategory}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
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
  /* width만 애니메이션 대상으로 좁힌다. "all"(속성 미지정)로 두면
     background-color(테마 토큰) 변경까지 이 트랜지션을 타서, 다크/라이트
     전환 시 이 요소만 서서히 바뀌고 나머지는 즉시 바뀌어 어긋나 보인다. */
  transition: width 0.2s ease-in-out;
`;

const HeaderContainer = styled.header<{ $sideCategory: string }>`
  position: fixed;
  margin: auto;
  top: 0;
  width: ${({ $sideCategory }) =>
    $sideCategory !== "" ? "calc(100% - 370px)" : "calc(100% - 56px)"};
  min-width: 1000px;
  padding-right: 20px;
  background: var(--color-canvas);
  z-index: 99;
  transition: width 0.2s ease-in-out;
`;

const MainContainer = styled.div<{ $sideCategory: string }>`
  width: 100%;
  max-width: ${({ $sideCategory }) =>
    $sideCategory !== "" ? "1080px" : "1280px"};
  min-width: 1000px;
  margin-top: 60px;
  padding-left: 20px;
  margin-left: max(0px, calc((100vw - 56px - 1280px) / 2));
  transition: max-width 0.2s ease-in-out;
`;

const SideBarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
`;
