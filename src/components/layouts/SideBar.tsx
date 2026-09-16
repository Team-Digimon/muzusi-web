import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import InvestIcon from "@/assets/icon/InvestIcon.svg?react";
import InterestIcon from "@/assets/icon/InterestIcon.svg?react";
import useDarkMode from "@/hooks/useDarkMode";

interface SideBarProps {
  sideCategory: string;
  setSideCategory: Dispatch<SetStateAction<string>>;
}

const SideBar = ({ sideCategory, setSideCategory }: SideBarProps) => {
  const { isDark, toggle: toggleDarkMode } = useDarkMode();

  const categoryHandler = (category: string) => () => {
    if (sideCategory === category) {
      setSideCategory("");
    } else {
      setSideCategory(category);
    }
  };

  return (
    <GlobalSideBar>
      <SideAnchor
        $isActive={sideCategory === "내 투자"}
        onClick={categoryHandler("내 투자")}
      >
        <SideBtn>
          <SideIcon>
            <InvestIcon />
          </SideIcon>
        </SideBtn>
        <span>내 투자</span>
      </SideAnchor>
      <SideAnchor
        $isActive={sideCategory === "예약"}
        onClick={categoryHandler("예약")}
      >
        <SideBtn>
          <SideIcon>
            <InterestIcon />
          </SideIcon>
        </SideBtn>
        <span>예약</span>
      </SideAnchor>
      {/* 아이콘은 "지금 상태"가 아니라 "눌렀을 때 바뀔 대상"을 보여준다
          (다크 모드일 땐 해, 라이트 모드일 땐 달). */}
      <ThemeToggleBtn
        type="button"
        onClick={toggleDarkMode}
        aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      >
        <SideBtn>
          <SideIcon>
            {isDark ? (
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M10 3.5V2M10 18v-1.5M4.4 4.4 3.3 3.3M16.7 16.7l-1.1-1.1M3.5 10H2M18 10h-1.5M4.4 15.6l-1.1 1.1M16.7 3.3l-1.1 1.1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M17 11.5A7.5 7.5 0 0 1 8.5 3 7.5 7.5 0 1 0 17 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </SideIcon>
        </SideBtn>
      </ThemeToggleBtn>
    </GlobalSideBar>
  );
};

export default SideBar;

const GlobalSideBar = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-canvas-soft);
  border-left: 1px solid var(--color-hairline);
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 0 24px;
  width: 56px;
  height: 100dvh;
  overflow: auto;
  z-index: 1;
`;

const SideAnchor = styled.a<{ $isActive: boolean }>`
  color: var(--color-ink-nav);
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
  color: ${({ $isActive }) => ($isActive ? "var(--color-ink-nav-active)" : "var(--color-ink-nav)")};
  cursor: pointer;

  div {
    background-color: ${({ $isActive }) => ($isActive ? "var(--color-hairline)" : null)};
  }

  svg path {
    fill: ${({ $isActive }) => ($isActive ? "var(--color-ink-nav-active)" : "var(--color-ink-nav)")};
  }

  &:hover {
    color: var(--color-ink-nav-active);
  }

  &:hover div {
    background-color: var(--color-hairline);
  }

  &:hover svg path {
    fill: var(--color-ink-nav-active);
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

const ThemeToggleBtn = styled.button`
  /* flex-direction: column인 GlobalSideBar에서 이 버튼만 맨 아래로 민다. */
  margin-top: auto;
  background: none;
  border: none;
  padding: 0;
  color: var(--color-ink-nav);
  cursor: pointer;

  &:hover {
    color: var(--color-ink-nav-active);
  }

  &:hover ${SideBtn} {
    background-color: var(--color-hairline);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
