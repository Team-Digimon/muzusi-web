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
