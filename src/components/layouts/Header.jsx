import styled from "styled-components";
import MuzusiLogo from "@/assets/logo/MuzusiLogo.png";
import SearchIcon from "@/assets/icon/SearchIcon.svg?react";
import signOut from "@/api/auth/signOut";
import useAuth from "@/contexts/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const currentPath = window.location.pathname;

  const handleLogout = async () => {
    try {
      const response = await signOut();
      if (response.code === 200) {
        logout();
      } else {
        console.error("로그아웃 실패", response);
      }
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

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
              <GNBAnchor href="/" $isActive={currentPath === "/"}>
                홈
              </GNBAnchor>
            </GNBBtn>
            <GNBBtn>
              <GNBAnchor
                href="/account"
                $isActive={currentPath.startsWith("/account")}
              >
                내 계좌
              </GNBAnchor>
            </GNBBtn>
            <SearchBtn>
              <SearchIconBox role="presentation">
                <SearchIcon />
              </SearchIconBox>
              <SearchText>이 곳을 눌러 검색하세요</SearchText>
            </SearchBtn>
          </GNBControl>
        </NavCenter>
        <NavLogin>
          {user ? (
            <>
              <LoginText>
                반갑습니다,
                <Nickname>{user?.nickname}</Nickname>님!
              </LoginText>
              <LoginBtn type="button" onClick={handleLogout}>
                로그아웃
              </LoginBtn>
            </>
          ) : (
            <>
              <LoginText>로그인하고 투자하기</LoginText>
              <LoginBtn type="button" href="/signin">
                로그인
              </LoginBtn>
            </>
          )}
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
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  color: ${({ $isActive }) => ($isActive ? "#333d4b" : "#4e5968")};
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

const SearchIconBox = styled.span`
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
  width: 300px;
`;

const LoginText = styled.span`
  margin: 0;
  padding: 0;
  font-weight: 600;
  font-size: 14px;
  color: #00132b94;
  line-height: 1.45;
`;

const Nickname = styled.span`
  font-weight: 700;
  color: #000;
`;

const LoginBtn = styled.a`
  display: flex;
  text-decoration: none;
  position: relative;
  width: auto;
  min-height: 32px;
  min-width: 16px;
  margin-left: 20px;
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
