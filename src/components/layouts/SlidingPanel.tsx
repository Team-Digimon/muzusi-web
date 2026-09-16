import useAuth from "@/contexts/useAuth";
import styled, { css } from "styled-components";
import { darkModeStyles } from "@/styles/darkMode";
import MuLogo from "@/assets/logo/MuLogo.webp";
import Holdings from "@/components/layouts/Holdings";
import Reservations from "@/components/layouts/Reservations";
import { useState } from "react";

interface SlidingPanelProps {
  sideCategory: string;
}

const SlidingPanel = ({ sideCategory }: SlidingPanelProps) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SlidingPanelContainer
      $sideCategory={sideCategory}
      $isModalOpen={isModalOpen}
    >
      <SideBarTitle>{sideCategory}</SideBarTitle>
      {user ? (
        sideCategory === "내 투자" ? (
          <Holdings />
        ) : (
          <Reservations
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )
      ) : (
        <ErrorContainer>
          <Logo src={MuLogo} alt="MuLogo" />
          <ErrorDescription>로그인 후 이용해주세요.</ErrorDescription>
        </ErrorContainer>
      )}
    </SlidingPanelContainer>
  );
};

export default SlidingPanel;

const SlidingPanelContainer = styled.div<{
  $sideCategory: string;
  $isModalOpen: boolean;
}>`
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: var(--color-canvas-soft);
  border-left: 1px solid var(--color-hairline);
  right: ${({ $sideCategory }) => ($sideCategory ? "0px" : "-370px")};
  width: 314px;
  min-width: 314px;
  margin-right: 56px;
  height: 100vh;
  padding: 16px;
  z-index: ${({ $isModalOpen }) => ($isModalOpen ? 999 : 99)};
  transition: 0.2s ease-in-out;
`;

const SideBarTitle = styled.div`
  height: 40px;
  font-weight: 600;
  color: var(--color-ink);
  line-height: 1.45;
  font-size: 17px;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--color-hairline);
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
  width: 100px;
  height: auto;
  ${darkModeStyles(css`
    filter: invert(1);
  `)}
`;

const ErrorDescription = styled.div`
  font-size: 15px;
  font-weight: 600;
`;
