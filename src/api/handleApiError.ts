import axios from "axios";
import type { ApiErrorPayload } from "@/types/api";

// 17개 API 함수에 중복되어 있던 에러 처리 블록을 공용 헬퍼로 추출.
// 두 가지 변형이 필요한 이유: 일부 호출부(CurrentAccount.jsx 등)는 서버가 내려준
// 실제 에러 코드(error.code)를 참조해 분기하므로, 그 경우엔 원본 페이로드를 그대로
// 던져야 한다. 나머지는 사용자에게 보여줄 일반 에러 메시지만 필요하다.

const logApiError = (error: unknown): void => {
  console.error("API 요청 중 오류 발생", error);
};

/** 서버 에러 페이로드 대신 일반화된 Error를 던진다. */
export const handleApiError = (error: unknown): never => {
  logApiError(error);

  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("응답 오류:", error.response.data);
      throw new Error("서버 오류 발생");
    }
    if (error.request) {
      console.error("네트워크 오류 또는 서버 응답 없음");
      throw new Error("네트워크 오류 또는 서버 응답 없음");
    }
  }

  console.error(
    "요청 설정 오류:",
    error instanceof Error ? error.message : error
  );
  throw new Error("요청 설정 오류");
};

/** 서버가 내려준 에러 페이로드({ code, message })를 그대로 던진다. */
export const handleApiErrorWithPayload = (error: unknown): never => {
  logApiError(error);

  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("응답 오류:", error.response.data);
      throw (error.response.data as ApiErrorPayload | undefined) ??
        new Error("서버 오류 발생");
    }
    if (error.request) {
      console.error("네트워크 오류 또는 서버 응답 없음");
      throw new Error("네트워크 오류 또는 서버 응답 없음");
    }
  }

  console.error(
    "요청 설정 오류:",
    error instanceof Error ? error.message : error
  );
  throw new Error("요청 설정 오류");
};
