import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { baseUrl } from "@/config/Env";
import { renderWithProviders } from "@/test/renderWithProviders";
import Holdings from "@/components/layouts/Holdings";

describe("Holdings", () => {
  it("보유 종목 조회에 성공하면 종목명과 평가 금액을 화면에 렌더링한다", async () => {
    renderWithProviders(<Holdings />);

    // 요청 완료 전에는 Loading이 먼저 보인다.
    expect(screen.getByAltText("Loading Logo")).toBeInTheDocument();

    // handlers.ts의 mock 데이터("무주시전자")가 화면에 반영될 때까지 대기.
    await waitFor(() => {
      expect(screen.getByText("무주시전자")).toBeInTheDocument();
    });

    // 10주 * 70,000원 = 700,000원
    expect(screen.getByText("700,000")).toBeInTheDocument();
  });

  it("보유 종목이 없으면 안내 문구를 렌더링한다", async () => {
    // 이 테스트에서만 handlers.ts의 기본 응답을 빈 배열로 덮어씀.
    // afterEach(server.resetHandlers())가 다음 테스트 전에 원상복구한다.
    server.use(
      http.get(new URL("accounts/holdings", baseUrl).toString(), () => {
        return HttpResponse.json({ code: 200, message: "OK", data: [] });
      })
    );

    renderWithProviders(<Holdings />);

    await waitFor(() => {
      expect(screen.getByText("예약된 주문이 없습니다.")).toBeInTheDocument();
    });
  });

  it("API 호출이 실패하면 에러 화면을 렌더링한다", async () => {
    server.use(
      http.get(new URL("accounts/holdings", baseUrl).toString(), () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<Holdings />);

    // Error 컴포넌트는 문구를 <br/>로 나눠 렌더링해 textContent가
    // "...실패했습니다.다시 시도해주세요."로 이어붙는다. 정확한 문자열
    // 매칭 대신 일부만 정규식으로 확인.
    await waitFor(() => {
      expect(
        screen.getByText(/정보를 불러오는데 실패했습니다/)
      ).toBeInTheDocument();
    });
  });
});
