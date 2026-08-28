import styled from "styled-components";
import MuzusiLogo from "@/assets/logo/MuzusiLogo.png";
import { kakaoLoginUrl, naverLoginUrl } from "@/config/Url";
import KakaoLogo from "@/assets/logo/KakaoLogo.svg?react";
import NaverLogo from "@/assets/logo/NaverLogo.svg?react";

const SignInForm = () => {
  return (
    <SignInFormContainer>
      <SignInFormLogo href="/">
        <SignInFormLogoImg
          alt="무주시"
          loading="lazy"
          decoding="async"
          src={MuzusiLogo}
        />
      </SignInFormLogo>
      <SignInText>무자본으로 시작하는 주식 시뮬레이션</SignInText>
      <LoginBtns>
        <KaKaoLoginBtn href={kakaoLoginUrl}>
          <Logo>
            <KakaoLogo />
          </Logo>
          <KakaoLoginText>카카오 로그인</KakaoLoginText>
        </KaKaoLoginBtn>
        <NaverLoginBtn href={naverLoginUrl}>
          <Logo>
            <NaverLogo />
          </Logo>
          <NaverLoginText>네이버 로그인</NaverLoginText>
        </NaverLoginBtn>
      </LoginBtns>
    </SignInFormContainer>
  );
};

export default SignInForm;

const SignInFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 450px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 10px 60px 2px rgba(0, 0, 0, 0.1);
  margin: auto;
  padding: 80px 50px;
`;

const SignInText = styled.div`
  color: #747474;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  margin: 0 auto;
`;

const SignInFormLogo = styled.a`
  margin: 0 auto;
`;

const SignInFormLogoImg = styled.img`
  width: 200px;
  height: auto;
  border: none;
  background: none;
`;

const LoginBtns = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LoginBtn = styled.a`
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
`;

const KaKaoLoginBtn = styled(LoginBtn)`
  height: 60px;
  background: #fee500;
  padding: 0 15px;
`;

const LoginText = styled.div`
  width: 100%;
  text-align: center;
  font-size: 25px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const KakaoLoginText = styled(LoginText)`
  color: #000;
`;

const NaverLoginBtn = styled(LoginBtn)`
  height: 60px;
  background: #5ac467;
  padding: 0 20px;
`;

const NaverLoginText = styled(LoginText)`
  color: #fff;
  margin-left: 15px;
`;
