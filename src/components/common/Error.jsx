import styled from "styled-components";
import MuLogo from "@/assets/logo/MuLogo.webp";

const Error = () => {
  return (
    <ErrorContainer>
      <Logo src={MuLogo} alt="MuLogo" />
      <TextContainer>
        <ErrorTitle>
          An error
          <br />
          has occurred
        </ErrorTitle>
        <ErrorDescription>
          정보를 불러오는데 실패했습니다.
          <br />
          다시 시도해주세요.
        </ErrorDescription>
      </TextContainer>
    </ErrorContainer>
  );
};

export default Error;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 80vh;
`;

const Logo = styled.img`
  width: 175px;
  height: auto;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ErrorTitle = styled.div`
  font-size: 40px;
  font-weight: 700;
`;

const ErrorDescription = styled.div`
  font-size: 25px;
  font-weight: 600;
`;
