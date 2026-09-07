import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";

/** 서버에 로그아웃을 알려 세션/리프레시 토큰을 무효화시킨다. */
const signOut = async (): Promise<ApiEnvelope<null>> => {
  try {
    const response = await authApi.get<ApiEnvelope<null>>(`auth/sign-out`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default signOut;
