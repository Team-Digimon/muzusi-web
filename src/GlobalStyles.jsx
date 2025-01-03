import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    scrollbar-width: thin;
    margin: 0;
    padding: 0;
  }
  body {
    font-family : pretendard;
  }
`;

export default GlobalStyles;
