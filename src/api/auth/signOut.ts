import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";

const signOut = async (): Promise<ApiEnvelope<null>> => {
  try {
    const response = await authApi.get<ApiEnvelope<null>>(`auth/sign-out`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default signOut;
