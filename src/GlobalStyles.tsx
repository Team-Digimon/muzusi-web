import { createGlobalStyle } from "styled-components";

// 색상 토큰은 DESIGN.md(무주시 디자인 시스템)에서 역추출한 라이트 모드
// 값을 기준으로 삼는다. 다크 모드 값은 시스템 설정(prefers-color-scheme)을
// 기본으로 따르되, useDarkMode 훅이 <html data-theme="..."> 속성을 직접
// 지정하면 그게 항상 우선한다 — 라이트/다크 양쪽 다 :not([data-theme="..."])
// 가드로 사용자의 명시적 선택이 시스템 설정을 덮어쓰도록 한다.
const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #000000;
    --color-on-primary: #ffffff;

    --color-up: #f04452;
    --color-up-hover: #e42939;
    --color-down: #3182f6;
    --color-down-hover: #2272eb;
    --color-neutral: #4e5968;

    --color-ink: #333d4b;
    --color-ink-heading: #191f28;
    --color-ink-mute: #6b7684;
    --color-ink-nav: #00132b94;
    --color-ink-nav-active: #000c1ecc;

    --color-canvas: #ffffff;
    --color-canvas-soft: #f6f7f9;
    --color-hairline: #dddddd;
    --color-hover-tint: #021f470d;
    /* DESIGN.md에 없는 확장 토큰: hover-tint보다 진한 "선택됨" 배경
       (뉴스 키워드 active 배경 등). hover-tint와 같은 네이비 계열, 알파만 2배. */
    --color-active-tint: #0220471a;
    --color-shadow-tint: #001b370a;
    /* DESIGN.md에 없는 확장 토큰: segment-toggle의 슬라이딩 필처럼
       "흰 배경으로 떠 있는" 요소 전용. 라이트에선 그냥 흰색이지만,
       다크에서까지 순백을 쓰면 어두운 화면 위에 흰 덩어리가 튀어서
       오히려 부자연스러워 보여 다크 전용 값을 따로 둔다. */
    --color-pill-surface: #ffffff;

    --color-danger-outlier: #ff0000;

    --color-chart-volume: #26a69a;
    --color-chart-balance-line: #e75151;
    --color-brand-kakao: #fee500;
    --color-brand-naver: #5ac467;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --color-primary: #ffffff;
      --color-on-primary: #000000;

      --color-neutral: #9aa5b1;

      --color-ink: #e5e8eb;
      --color-ink-heading: #f7f8f9;
      --color-ink-mute: #8b95a1;
      --color-ink-nav: #ffffff94;
      --color-ink-nav-active: #ffffffcc;

      --color-canvas: #121417;
      --color-canvas-soft: #1c1f24;
      --color-hairline: #33373d;
      --color-hover-tint: #ffffff14;
      --color-active-tint: #ffffff29;
      --color-shadow-tint: #00000066;
      --color-pill-surface: #2e323a;

      --color-danger-outlier: #ff6b6b;
    }
  }

  :root[data-theme="dark"] {
    --color-primary: #ffffff;
    --color-on-primary: #000000;

    --color-neutral: #9aa5b1;

    --color-ink: #e5e8eb;
    --color-ink-heading: #f7f8f9;
    --color-ink-mute: #8b95a1;
    --color-ink-nav: #ffffff94;
    --color-ink-nav-active: #ffffffcc;

    --color-canvas: #121417;
    --color-canvas-soft: #1c1f24;
    --color-hairline: #33373d;
    --color-hover-tint: #ffffff14;
    --color-active-tint: #ffffff29;
    --color-shadow-tint: #00000066;
    --color-pill-surface: #2e323a;

    --color-danger-outlier: #ff6b6b;
  }

  * {
    box-sizing: border-box;
    scrollbar-width: thin;
    margin: 0;
    padding: 0;
  }
  body {
    font-family : pretendard;
    background-color: var(--color-canvas);
    color: var(--color-ink);
  }

  /* useDarkMode의 applyTheme이 테마를 바꾸는 그 프레임에만 이 클래스를
     붙인다. 코드베이스 곳곳에 호버용 "transition: 0.2s;"(속성 미지정,
     사실상 all)가 많아서, 테마 토큰이 바뀔 때 그 트랜지션까지 같이
     타면 요소마다 서로 다른 시점에 색이 바뀌어 보인다(깜빡이는 것처럼
     보이는 원인). 이 순간만 전부 강제로 트랜지션을 꺼서 한 프레임에
     동시에 바뀌게 하고, 다음 프레임에 다시 켜서 호버 애니메이션 등
     기존 동작은 그대로 둔다. */
  .theme-transitioning,
  .theme-transitioning * {
    transition: none !important;
  }
`;

export default GlobalStyles;
