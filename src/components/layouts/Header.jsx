import styled from "styled-components";
import MuzusiLogo from "@/assets/logo/MuzusiLogo.png";
import SearchIcon from "@/assets/icon/SearchIcon.svg?react";
import signOut from "@/api/auth/signOut";
import useAuth from "@/contexts/useAuth";
import React, { useCallback, useMemo, useState } from "react";
import getStocksSearch from "@/api/stocks/getStocksSearch";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const currentPath = window.location.pathname;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedStocks, setSearchedStocks] = useState([]);

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

  const openSearchModal = () => {
    setIsModalOpen(true);
    setSearchText("");
  };

  const closeSearchModal = () => {
    setIsModalOpen(false);
  };

  const fetchSearchResults = useCallback(async (keyword) => {
    if (!keyword) return;
    try {
      const response = await getStocksSearch({ keyword: keyword });
      setSearchedStocks(response.data);
    } catch (error) {
      console.error("검색 결과 가져오기 실패: ", error.message);
    }
  }, []);

  const debouncedFetchSearchResults = useMemo(
    () => debounce((keyword) => fetchSearchResults(keyword), 500),
    [fetchSearchResults]
  );

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchText(inputValue);
    debouncedFetchSearchResults(inputValue);
  };

  const HighlightedText = ({ text, highlight }) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <Highlighted key={index}>{part}</Highlighted>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const handleClickSearchedStock = (stock) => () => {
    navigate(`stocks/${stock.stockCode}`, { state: { stock } });
  };

  React.useEffect(() => {
    return () => {
      debouncedFetchSearchResults.cancel();
    };
  }, [debouncedFetchSearchResults]);

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
            <SearchBtn onClick={openSearchModal}>
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
      {isModalOpen && (
        <ModalBackground onClick={closeSearchModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalSearchBox>
              <SearchIconBox role="presentation">
                <SearchIcon />
              </SearchIconBox>
              <ModalSearchText
                placeholder="검색어를 입력해주세요"
                value={searchText}
                onChange={handleInputChange}
              />
            </ModalSearchBox>
            {searchText ? (
              <SearchedStocks>
                {searchedStocks.map((el, index) => {
                  return (
                    <SearchedStock
                      key={index}
                      onClick={handleClickSearchedStock(el)}
                    >
                      <SearchedStockName>
                        <HighlightedText
                          text={el.stockName}
                          highlight={searchText}
                        />
                      </SearchedStockName>
                      <SearchedStockCode>{el.stockCode}</SearchedStockCode>
                    </SearchedStock>
                  );
                })}
              </SearchedStocks>
            ) : (
              <SearchNotice>찾고자 하는 종목명을 입력해주세요!</SearchNotice>
            )}
          </ModalContent>
        </ModalBackground>
      )}
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

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  width: 40%;
  min-width: 600px;
  max-height: 500px;
  margin-top: 10px;
`;

const ModalSearchBox = styled.div`
  width: calc(100% - 24px);
  height: 40px;
  min-height: 40px;
  margin: 12px 12px 16px;
  background-color: #0220470d;
  border-radius: 50px;
  display: flex;
  align-items: center;
`;

const ModalSearchText = styled.input`
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 14px;
  color: #191f28;
  &::placeholder {
    color: #8b95a1;
  }
`;

const SearchedStocks = styled.div`
  width: calc(100% - 32px);
  margin: 0px 16px 16px 16px;
  display: block;
  overflow: auto;
`;

const SearchedStock = styled.div`
  width: 100%;
  height: 55px;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #0220470d;
  }
`;

const SearchedStockName = styled.div`
  font-weight: bold;
  color: #333d4b;
  line-height: 1.45;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
`;

const SearchedStockCode = styled.div`
  font-weight: 500;
  color: #6b7684;
  line-height: 1.45;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
`;

const Highlighted = styled.span`
  color: #f04452;
`;

const SearchNotice = styled.div`
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: #191f28;
`;
