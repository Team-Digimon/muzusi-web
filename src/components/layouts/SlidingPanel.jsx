import useAuth from "@/contexts/useAuth";
import PropTypes from "prop-types";
import styled from "styled-components";
import MuLogo from "@/assets/logo/MuLogo.webp";
import Holdings from "@/components/layouts/Holdings";

const SlidingPanel = ({ sideCartegory }) => {
  const { user } = useAuth();

  return (
    <SlidingPanelContainer $sideCartegory={sideCartegory}>
      <SideBarTitle>{sideCartegory}</SideBarTitle>
      {user ? (
        sideCartegory === "내 투자" && <Holdings />
      ) : (
        <ErrorContainer>
          <Logo src={MuLogo} alt="MuLogo" />
          <ErrorDescription>로그인 후 이용해주세요.</ErrorDescription>
        </ErrorContainer>
      )}
    </SlidingPanelContainer>
  );
};

SlidingPanel.propTypes = {
  sideCartegory: PropTypes.string.isRequired,
};

export default SlidingPanel;

const SlidingPanelContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: #f6f7f9;
  border-left: 1px solid #001b371a;
  right: ${({ $sideCartegory }) => ($sideCartegory ? "0px" : "-370px")};
  width: 314px;
  min-width: 314px;
  margin-right: 56px;
  height: 100vh;
  padding: 16px;
  z-index: 9998;
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
