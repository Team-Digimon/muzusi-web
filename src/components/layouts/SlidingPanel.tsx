import useAuth from "@/contexts/useAuth";
import styled from "styled-components";
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
  background-color: #f6f7f9;
  border-left: 1px solid #001b371a;
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
  color: #333d4b;
  line-height: 1.45;
  font-size: 17px;
  margin-bottom: 15px;
  border-bottom: 1px solid #001b371a;
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
`;

const ErrorDescription = styled.div`
  font-size: 15px;
  font-weight: 600;
`;
