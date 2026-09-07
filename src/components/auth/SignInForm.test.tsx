import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SignInForm from "@/components/auth/SignInForm";

describe("SignInForm", () => {
  it("카카오/네이버 로그인 버튼을 각 provider의 OAuth 주소로 렌더링한다", () => {
    render(<SignInForm />);

    // 정확한 client_id/redirect_uri까지는 Url.ts 자체의 관심사라,
    // 여기서는 "올바른 로그인 제공자로 연결되는가"만 확인한다.
    const kakaoLink = screen.getByRole("link", { name: "카카오 로그인" });
    expect(kakaoLink).toHaveAttribute(
      "href",
      expect.stringContaining("https://kauth.kakao.com/oauth/authorize")
    );

    const naverLink = screen.getByRole("link", { name: "네이버 로그인" });
    expect(naverLink).toHaveAttribute(
      "href",
      expect.stringContaining("https://nid.naver.com/oauth2.0/authorize")
    );
  });

  it("서비스 소개 문구를 렌더링한다", () => {
    render(<SignInForm />);

    expect(
      screen.getByText("무자본으로 시작하는 주식 시뮬레이션")
    ).toBeInTheDocument();
  });
});
