import styled from "styled-components";
import MuzusiLogo from "../../assets/MuzusiLogo.png";

const Header = () => {
  return (
    <GlobalNavBar>
      <NavBar>
        <NavLogo href="/">
          <LogoImg
            alt="무주시"
            loading="lazy"
            decoding="async"
            src={MuzusiLogo}
          />
        </NavLogo>
        <NavCenter>
          <GNBControl>
            <GNBBtn>
              <GNBAnchor href="/">홈</GNBAnchor>
            </GNBBtn>
            <GNBBtn>
              <GNBAnchor href="/">내 계좌</GNBAnchor>
            </GNBBtn>
            <SearchBtn>
              <SearchIcon role="presentation">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" stroke="#a5afb9" strokeMiterlimit="10">
                    <circle
                      cx="10.389"
                      cy="10.388"
                      r="7.395"
                      strokeWidth="2.032"
                    />
                    <path
                      d="m15.64 15.638 5.517 5.517"
                      strokeLinecap="round"
                      strokeWidth="2.001"
                    />
                  </g>
                </svg>
              </SearchIcon>
              <SearchText>이 곳을 눌러 검색하세요</SearchText>
            </SearchBtn>
          </GNBControl>
        </NavCenter>
        <NavLogin>
          <LoginText>로그인하고 투자하기</LoginText>
          <LoginBtn type="button" href="/signin">
            로그인
          </LoginBtn>
        </NavLogin>
      </NavBar>
    </GlobalNavBar>
  );
};

export default Header;

const GlobalNavBar = styled.div`
  top: 0;
  height: 60px;
  position: sticky;
  width: 100%;
  z-index: 10001;
  max-width: 1280px;
  margin: auto;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const NavLogo = styled.a``;

const LogoImg = styled.img`
  width: auto;
  height: 40px;
  size: 100vh;
  border: none;
`;

const NavCenter = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const GNBControl = styled.ul`
  display: flex;
  gap: 10px;
  padding: 10px;
  margin: 0;
  border: none;
  align-items: center;
`;

const GNBBtn = styled.li`
  list-style: none;
  font-size: 15px;
  line-height: 1.45;
  cursor: pointer;
`;

const GNBAnchor = styled.a`
  color: #6b7684;
  text-decoration: none;
  padding: 10px;
  font-weight: 500;
  &:hover {
    font-weight: 700;
    color: #333d4b;
  }
`;

const SearchBtn = styled.button`
  background-color: #0220470d;
  border-radius: 38px;
  height: 38px;
  width: 230px;
  margin-left: 16px;
  display: flex;
  align-items: center;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
`;

const SearchIcon = styled.span`
  height: 16px;
  width: 16px;
  margin-left: 16px;
  margin-right: 12px;
`;

const SearchText = styled.span`
  margin: 0;
  padding: 0;
  font-weight: 500;
  font-size: 15px;
  color: #8b95a1;
  line-height: 1.45;
`;

const NavLogin = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 250px;
`;

const LoginText = styled.span`
  margin: 0;
  padding: 0;
  font-weight: 600;
  font-size: 14px;
  color: #00132b94;
  line-height: 1.45;
`;

const LoginBtn = styled.a`
  display: flex;
  text-decoration: none;
  position: relative;
  width: auto;
  min-height: 32px;
  min-width: 16px;
  margin: 0px 20px;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
  align-items: center;
  border: none;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 16px;
  color: #fff;
  background-color: #000;
`;
