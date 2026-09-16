import { css, type RuleSet } from "styled-components";

/**
 * GlobalStyles의 다크 모드 감지 조건(명시적 선택이 우선, 없으면 시스템
 * 설정)과 동일한 기준으로, 개별 styled-component에 다크 모드 전용
 * 스타일을 끼워 넣을 때 쓴다. 주로 CSS 변수로 못 바꾸는 raster 이미지의
 * `filter: invert(1)` 같은 경우에 사용.
 */
export const darkModeStyles = (styles: RuleSet) => css`
  @media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) & {
      ${styles}
    }
  }
  html[data-theme="dark"] & {
    ${styles}
  }
`;
