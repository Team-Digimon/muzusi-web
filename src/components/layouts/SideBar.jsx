import styled from "styled-components";
import InvestIcon from "@/assets/icon/InvestIcon.svg?react";
import InterestIcon from "@/assets/icon/InterestIcon.svg?react";
import PropTypes from "prop-types";

const SideBar = ({ sideCartegory, setSideCartegory }) => {
  const cartegoryHandler = (cartegory) => () => {
    if (sideCartegory === cartegory) {
      setSideCartegory("");
    } else {
      setSideCartegory(cartegory);
    }
  };

  return (
    <GlobalSideBar>
      <SideAnchor
        $isActive={sideCartegory === "내 투자"}
        onClick={cartegoryHandler("내 투자")}
      >
        <SideBtn>
          <SideIcon>
            <InvestIcon />
          </SideIcon>
        </SideBtn>
        <span>내 투자</span>
      </SideAnchor>
      <SideAnchor
        $isActive={sideCartegory === "관심"}
        onClick={cartegoryHandler("관심")}
      >
        <SideBtn>
          <SideIcon>
            <InterestIcon />
          </SideIcon>
        </SideBtn>
        <span>관심</span>
      </SideAnchor>
    </GlobalSideBar>
  );
};

SideBar.propTypes = {
  sideCartegory: PropTypes.string.isRequired,
  setSideCartegory: PropTypes.func.isRequired,
};

export default SideBar;

const GlobalSideBar = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f7f9;
  border-left: 1px solid #001b371a;
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 0 24px;
  width: 56px;
  height: 100dvh;
  overflow: auto;
  z-index: 1;
`;

const SideAnchor = styled.a`
  color: #00132b94;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 46px;
  height: 64px;
  margin: 0;
  padding: 0;
  font-size: 12px;
  line-height: 1.45;
  color: ${({ $isActive }) => ($isActive ? "#000c1ecc" : "#00132b94")};
  cursor: pointer;

  div {
    background-color: ${({ $isActive }) => ($isActive ? "#dee1e5" : null)};
  }

  svg path {
    fill: ${({ $isActive }) => ($isActive ? "#000c1ecc" : "#00132b94")};
  }

  &:hover {
    color: #000c1ecc;
  }

  &:hover div {
    background-color: #dee1e5;
  }

  &:hover svg path {
    fill: #000c1ecc;
    transition: background-color 0.3s ease;
  }
`;

const SideBtn = styled.div`
  margin-bottom: 2px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SideIcon = styled.span`
  height: 20px;
  width: 20px;
  display: inline-block;
`;
