export interface ChartThemeColors {
  background: string;
  textColor: string;
  gridColor: string;
}

const getCssVar = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * lightweight-charts는 canvas 기반이라 CSS 변수(var(--color-x))를 직접
 * 못 읽는다 — 매번 실제 계산된 색상값을 문자열로 넘겨야 해서, GlobalStyles의
 * 토큰을 읽어와 캔버스용 팔레트로 변환한다.
 */
export const getChartThemeColors = (): ChartThemeColors => ({
  background: getCssVar("--color-canvas") || "#ffffff",
  textColor: getCssVar("--color-ink-heading") || "#000000",
  gridColor: getCssVar("--color-hairline") || "#e1e1e1"
});

/**
 * data-theme 속성이 바뀌는 경우(수동 토글)와 prefers-color-scheme이
 * 바뀌는 경우(시스템 설정, 명시적 선택이 없을 때) 둘 다 감지해서 콜백을
 * 호출한다. useDarkMode 훅과 별개로 필요한 이유: 차트는 리렌더가 아니라
 * chart.applyOptions() 명령형 호출로만 갱신되므로, 색이 바뀌는 시점에
 * 실제 색상값을 직접 계산해서 넘겨줘야 한다.
 */
export const subscribeToChartTheme = (
  onChange: (colors: ChartThemeColors) => void
): (() => void) => {
  const handleChange = () => onChange(getChartThemeColors());

  const observer = new MutationObserver(handleChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });

  // jsdom 등 일부 환경엔 matchMedia 자체가 없다.
  const mediaQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
  mediaQuery?.addEventListener("change", handleChange);

  return () => {
    observer.disconnect();
    mediaQuery?.removeEventListener("change", handleChange);
  };
};
