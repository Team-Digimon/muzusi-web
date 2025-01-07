import styled from "styled-components";
import MuzusiLogo from "../../assets/MuzusiLogo.png";

const SignInForm = () => {
  const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_REST_API_KEY;
  const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;

  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&response_type=code`;

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
            >
              <path
                d="M25 6.25C37.0833 6.25 46.8771 13.8833 46.8771 23.3021C46.8771 32.7188 37.0833 40.3521 25.0021 40.3521C23.7992 40.35 22.5976 40.2734 21.4042 40.1229L12.2208 46.1292C11.1771 46.6812 10.8083 46.6208 11.2375 45.2687L13.0958 37.6063C7.09582 34.5646 3.12708 29.2938 3.12708 23.3021C3.12708 13.8854 12.9187 6.25 25.0021 6.25M37.3104 23.0417L40.3729 20.075C40.5496 19.8915 40.6482 19.6465 40.6479 19.3918C40.6476 19.137 40.5484 18.8923 40.3713 18.7092C40.1941 18.5261 39.9528 18.4189 39.6982 18.4102C39.4436 18.4015 39.1955 18.4919 39.0062 18.6625L34.9896 22.55V19.3375C34.9896 19.0767 34.886 18.8266 34.7016 18.6422C34.5171 18.4578 34.267 18.3542 34.0062 18.3542C33.7454 18.3542 33.4953 18.4578 33.3109 18.6422C33.1265 18.8266 33.0229 19.0767 33.0229 19.3375V24.6646C32.9882 24.8168 32.9882 24.9749 33.0229 25.1271V28.125C33.0229 28.3858 33.1265 28.6359 33.3109 28.8203C33.4953 29.0047 33.7454 29.1083 34.0062 29.1083C34.267 29.1083 34.5171 29.0047 34.7016 28.8203C34.886 28.6359 34.9896 28.3858 34.9896 28.125V25.2854L35.8792 24.425L38.8542 28.6604C38.9284 28.7662 39.0228 28.8562 39.1319 28.9255C39.241 28.9948 39.3627 29.0419 39.49 29.0641C39.6172 29.0864 39.7477 29.0833 39.8738 29.0552C39.9999 29.027 40.1193 28.9743 40.225 28.9C40.3307 28.8257 40.4208 28.7313 40.4901 28.6223C40.5593 28.5132 40.6064 28.3915 40.6287 28.2642C40.6509 28.1369 40.6479 28.0065 40.6197 27.8804C40.5916 27.7542 40.5389 27.6349 40.4646 27.5292L37.3104 23.0417ZM31.1479 27.05H28.1062V19.3687C28.0946 19.1161 27.986 18.8776 27.8031 18.7029C27.6201 18.5282 27.3769 18.4307 27.1239 18.4307C26.871 18.4307 26.6278 18.5282 26.4448 18.7029C26.2619 18.8776 26.1533 19.1161 26.1417 19.3687V28.0333C26.1417 28.575 26.5792 29.0167 27.1229 29.0167H31.1479C31.4087 29.0167 31.6588 28.9131 31.8432 28.7287C32.0276 28.5442 32.1312 28.2941 32.1312 28.0333C32.1312 27.7725 32.0276 27.5224 31.8432 27.338C31.6588 27.1536 31.4087 27.05 31.1479 27.05ZM18.9458 24.7771L20.3958 21.2188L21.725 24.775L18.9458 24.7771ZM24.2021 25.7917L24.2062 25.7583C24.2055 25.5106 24.111 25.2724 23.9417 25.0917L21.7625 19.2583C21.6711 18.9804 21.4971 18.7369 21.2637 18.5604C21.0303 18.3839 20.7486 18.2829 20.4562 18.2708C20.162 18.2707 19.8746 18.3596 19.6318 18.5258C19.389 18.692 19.2022 18.9277 19.0958 19.2021L15.6333 27.6917C15.5347 27.9331 15.536 28.2039 15.637 28.4443C15.738 28.6848 15.9304 28.8753 16.1719 28.974C16.4133 29.0726 16.6841 29.0713 16.9245 28.9703C17.165 28.8693 17.3555 28.6769 17.4542 28.4354L18.1458 26.7417H22.4583L23.0792 28.4083C23.1215 28.5329 23.1884 28.6477 23.276 28.746C23.3635 28.8442 23.4699 28.9239 23.5887 28.9803C23.7076 29.0367 23.8366 29.0686 23.9681 29.0743C24.0995 29.0799 24.2308 29.0591 24.3541 29.0131C24.4773 28.9671 24.5901 28.8968 24.6857 28.8064C24.7813 28.716 24.8578 28.6073 24.9107 28.4868C24.9635 28.3663 24.9917 28.2364 24.9934 28.1048C24.9952 27.9733 24.9705 27.8427 24.9208 27.7208L24.2021 25.7917ZM17.2792 19.3792C17.2797 19.2501 17.2547 19.1221 17.2056 19.0027C17.1565 18.8833 17.0843 18.7747 16.9931 18.6834C16.9019 18.592 16.7935 18.5195 16.6742 18.4702C16.5549 18.4208 16.427 18.3956 16.2979 18.3958H9.53749C9.2767 18.3958 9.02658 18.4994 8.84217 18.6838C8.65776 18.8683 8.55416 19.1184 8.55416 19.3792C8.55416 19.64 8.65776 19.8901 8.84217 20.0745C9.02658 20.2589 9.2767 20.3625 9.53749 20.3625H11.9542V28.1458C11.9542 28.4066 12.0578 28.6567 12.2422 28.8412C12.4266 29.0256 12.6767 29.1292 12.9375 29.1292C13.1983 29.1292 13.4484 29.0256 13.6328 28.8412C13.8172 28.6567 13.9208 28.4066 13.9208 28.1458V20.3625H16.2958C16.4251 20.3631 16.5532 20.338 16.6728 20.2888C16.7923 20.2395 16.901 20.1671 16.9924 20.0757C17.0838 19.9843 17.1562 19.8757 17.2054 19.7561C17.2547 19.6366 17.2797 19.5085 17.2792 19.3792Z"
                fill="black"
              />
            </svg>
          </Logo>
          <KakaoLoginText>카카오 로그인</KakaoLoginText>
        </KaKaoLoginBtn>
        <NaverLoginBtn href={naverLoginUrl}>
          <Logo>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
            >
              <path
                d="M23.7315 18.7323L10.7567 0H0V35H11.2671V16.2692L24.2433 35H35V0H23.7315V18.7323Z"
                fill="white"
              />
            </svg>
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