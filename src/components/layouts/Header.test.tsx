import { describe, expect, it } from "vitest";
import Header from "@/components/layouts/Header";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/contexts/AuthProvider";

const renderHeader = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>
          <Header sideCategory='' />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe("Header", () => {
  it("'/' 키를 누르면 모달이 열리고, 'ESC' 키를 누르면 닫힌다.", () => {
    renderHeader();

    expect(screen.getByText(/를 눌러 검색하세요/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "/" });

    expect(
      screen.getByText("찾고자 하는 종목명을 입력해주세요!")
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(
      screen.queryByText("찾고자 하는 종목명을 입력해주세요!")
    ).not.toBeInTheDocument();
  });
});
