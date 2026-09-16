import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

type Theme = "light" | "dark";

// localStorage는 테스트 환경(jsdom)이나 Safari 프라이빗 모드처럼 접근
// 자체가 막혀있을 수 있어, 없는 셈 치고 넘어가도록 방어적으로 감싼다.
const getStoredTheme = (): Theme | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
};

// jsdom 등 window.matchMedia가 아예 없는 환경도 있어 존재 여부부터 확인한다.
const getSystemTheme = (): Theme =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

// 코드베이스 곳곳에 호버용 "transition: 0.2s;"(속성 미지정이라 사실상
// all)가 많아서, 테마 토큰이 바뀔 때 그 트랜지션까지 같이 타면 요소마다
// 서로 다른 시점에 색이 바뀐 것처럼 보인다. mutate 실행 직전·직후에
// .theme-transitioning 클래스로 트랜지션을 강제로 끄고, 강제 리플로우로
// "꺼진 채로" 스타일이 재계산되게 확정한 다음, 다음 프레임에 다시 켜서
// 호버 애니메이션 등 기존 동작은 그대로 둔다.
const withTransitionsDisabled = (mutate: () => void) => {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  mutate();
  void root.offsetHeight;
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => root.classList.remove("theme-transitioning"));
  } else {
    root.classList.remove("theme-transitioning");
  }
};

const applyTheme = (theme: Theme | null) => {
  withTransitionsDisabled(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  });
};

/**
 * 사용자가 명시적으로 고른 테마(localStorage)가 있으면 그걸
 * <html data-theme>에 반영하고, 없으면 속성을 아예 안 붙여서
 * GlobalStyles의 prefers-color-scheme 미디어쿼리가 시스템 설정을
 * 따르게 둔다. 명시적 선택이 없는 동안엔 OS 테마가 바뀌면 실시간 반영한다.
 */
const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = getStoredTheme();
    return stored ? stored === "dark" : getSystemTheme() === "dark";
  });

  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    if (getStoredTheme() || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) =>
      withTransitionsDisabled(() => setIsDark(event.matches));

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      const theme: Theme = next ? "dark" : "light";
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // 저장에 실패해도 이번 세션 동안의 토글 자체는 계속 동작해야 한다.
      }
      applyTheme(theme);
      return next;
    });
  }, []);

  return { isDark, toggle };
};

export default useDarkMode;
