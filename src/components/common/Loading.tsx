import styled, { keyframes } from "styled-components";
import MuLogo from "@/assets/logo/MuLogo.webp";

const Loading = () => {
  return (
    <LoadingContainer>
      <Logo src={MuLogo} alt="Loading Logo" />
    </LoadingContainer>
  );
};

export default Loading;

const blink = keyframes`
  0%, 100% {width: 60px; opacity: 1;}
  50% {width: 50px; opacity: 0.2;}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Logo = styled.img`
  width: 50px;
  height: auto;
  animation: ${blink} 1s infinite;
`;
