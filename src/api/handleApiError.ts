import axios from "axios";
import { isApiErrorPayload } from "@/types/api";

/**
 * 17개 API 함수에 중복되던 에러 처리 블록을 추출한 공용 헬퍼 모듈.
 * 두 가지 변형이 있는 이유는 호출부의 필요가 다르기 때문이다.
 * - `handleApiError`: 사용자에게 보여줄 일반 에러 메시지만 필요한 호출부용
 * - `handleApiErrorWithPayload`: 서버가 내려준 실제 에러 코드(`error.code`)로
 *   분기해야 하는 호출부(예: 계좌 관련 API)용 — 원본 페이로드를 그대로 던진다
 */

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
      // 서버가 { code, message } 형태의 페이로드를 내려줬을 때만 그걸
      // 그대로 던진다. 응답 바디가 없거나(빈 문자열 등) 형태가 다르면
      // 일반화된 Error로 대체 — 이전엔 `?? new Error(...)`를 썼는데,
      // ??는 null/undefined일 때만 대체하므로 빈 문자열처럼 falsy하지만
      // nullish는 아닌 값은 그대로 통과해 throw ''가 됐다. 그러면 이 값을
      // 받는 쪽의 `if (error) return <Error />` 같은 체크가 빈 문자열은
      // falsy라 에러가 아닌 것처럼 통과해버리는 버그로 이어짐.
      throw isApiErrorPayload(error.response.data)
        ? error.response.data
        : new Error("서버 오류 발생");
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
