// 세션 스토리지에 저장되는 유저 정보. 앱 전체에서 실제로 쓰이는 필드는
// nickname뿐이라 최소한으로 정의한다.
export interface User {
  nickname: string;
}

export interface SocialSignInData {
  accessToken: string;
  isRegistered: boolean;
}

export interface SignUpData {
  accessToken: string;
}

export interface ReissueTokenData {
  accessToken: string;
}
