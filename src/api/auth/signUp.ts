import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { SignUpData } from "@/types/auth";

const signUp = async (
  nickname: string
): Promise<ApiEnvelope<SignUpData>> => {
  try {
    const response = await authApi.post<ApiEnvelope<SignUpData>>(
      `auth/sign-up`,
      { nickname }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default signUp;
