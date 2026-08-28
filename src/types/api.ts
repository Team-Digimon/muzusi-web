// 백엔드 공통 응답 포맷. 모든 API가 { code, message, data } 구조로 감싸서 내려준다.
export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

// 에러 응답의 code는 백엔드에서 문자열 코드("0008", "4003" 등)로 내려온다.
export interface ApiErrorPayload {
  code: string;
  message: string;
}

// handleApiErrorWithPayload를 쓰는 API는 서버 에러 페이로드를 그대로 던지거나
// (네트워크 오류 등 페이로드가 없을 때는) 일반 Error를 던진다. 호출부에서
// catch (error: unknown)의 error가 둘 중 뭔지 구분할 때 쓰는 타입가드.
export const isApiErrorPayload = (error: unknown): error is ApiErrorPayload =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "message" in error;
