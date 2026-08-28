import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import styled from "styled-components";
import MuLogo from "@/assets/logo/MuLogo.webp";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// 렌더링 중 발생하는 예상치 못한 에러를 잡아내는 전역 경계.
// 기존 Error 컴포넌트는 API 요청 실패 같은 "예상된" 에러만 처리하므로,
// 컴포넌트 렌더링 자체에서 던져지는 에러는 이 바운더리가 아니면 화이트스크린으로 이어진다.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("렌더링 중 예상치 못한 오류가 발생했습니다:", error, errorInfo);
  }

  handleReload = (): void => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <Logo src={MuLogo} alt="MuLogo" />
          <TextContainer>
            <ErrorTitle>
              Something
              <br />
              went wrong
            </ErrorTitle>
            <ErrorDescription>
              예상치 못한 오류가 발생했습니다.
              <br />
              홈으로 돌아가 다시 시도해주세요.
            </ErrorDescription>
            <ReloadButton type="button" onClick={this.handleReload}>
              홈으로 이동
            </ReloadButton>
          </TextContainer>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 100vh;
`;

const Logo = styled.img`
  width: 175px;
  height: auto;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ErrorTitle = styled.div`
  font-size: 40px;
  font-weight: 700;
`;

const ErrorDescription = styled.div`
  font-size: 25px;
  font-weight: 600;
`;

const ReloadButton = styled.button`
  margin-top: 12px;
  align-self: flex-start;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #000;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;
