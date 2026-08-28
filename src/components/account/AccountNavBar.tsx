import { useLocation } from "react-router-dom";
import styled from "styled-components";

const AccountNavBar = () => {
  const location = useLocation();

  const accountNavBtns = [
    { value: "asset", korean: "자산" },
    { value: "transactions", korean: "거래 내역" },
    { value: "records", korean: "전체 계좌 기록" },
  ];

  return (
    <AccountNav>
      <AccountNavBtns>
        {accountNavBtns.map((el, index) => {
          return (
            <AccountNavBtn key={index}>
              <AccountNavAnchor
                href={el.value}
                $isActive={location.pathname.includes(el.value)}
              >
                {el.korean}
              </AccountNavAnchor>
            </AccountNavBtn>
          );
        })}
      </AccountNavBtns>
    </AccountNav>
  );
};

export default AccountNavBar;

const AccountNav = styled.nav`
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 60px;
  width: 184px;
`;

const AccountNavBtns = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AccountNavBtn = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
`;

const AccountNavAnchor = styled.a<{ $isActive: boolean }>`
  text-decoration: none;
  padding: 8px 14px;
  width: 100%;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.45;
  transition: 0.3s;
  cursor: pointer;
  font-weight: ${({ $isActive }) => ($isActive ? "bold" : 500)};
  color: ${({ $isActive }) => ($isActive ? "#000c1ecc" : "#031228b2")};
  background: ${({ $isActive }) => ($isActive ? "#0220470D" : "#fff")};
  &:hover {
    background: #0220470d;
  }
`;
