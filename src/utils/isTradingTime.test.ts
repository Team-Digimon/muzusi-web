import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import isTradingTime from "@/utils/isTradingTime";

// isTradingTime 내부에서 new Date()로 "지금"을 읽기 때문에, 언제 테스트를
// 실행하든 같은 결과가 나오도록 시스템 시각을 가짜로 고정해야 한다.
const setNow = (isoLike: string) => {
  vi.setSystemTime(new Date(isoLike));
};

describe("isTradingTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("평일 장중(예: 화요일 10:00)이면 true를 반환한다", () => {
    setNow("2026-09-01T10:00:00"); // 2026-09-01은 화요일
    expect(isTradingTime()).toBe(true);
  });

  it("개장 시각(09:00) 정각이면 true를 반환한다", () => {
    setNow("2026-09-01T09:00:00");
    expect(isTradingTime()).toBe(true);
  });

  it("개장 1분 전(08:59)이면 false를 반환한다", () => {
    setNow("2026-09-01T08:59:00");
    expect(isTradingTime()).toBe(false);
  });

  it("폐장 시각(15:30) 정각이면 true를 반환한다", () => {
    setNow("2026-09-01T15:30:00");
    expect(isTradingTime()).toBe(true);
  });

  it("폐장 1분 후(15:31)면 false를 반환한다", () => {
    setNow("2026-09-01T15:31:00");
    expect(isTradingTime()).toBe(false);
  });

  it("주말(토요일)이면 장중 시간대여도 false를 반환한다", () => {
    setNow("2026-09-05T10:00:00"); // 2026-09-05는 토요일
    expect(isTradingTime()).toBe(false);
  });

  it("주말(일요일)이면 장중 시간대여도 false를 반환한다", () => {
    setNow("2026-09-06T10:00:00"); // 2026-09-06은 일요일
    expect(isTradingTime()).toBe(false);
  });
});
