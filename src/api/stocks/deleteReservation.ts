import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";

/** 아직 체결되지 않은 예약 주문(`tradeReservationId`)을 취소한다. */
const deleteReservation = async ({
  tradeReservationId,
}: {
  tradeReservationId: string;
}): Promise<ApiEnvelope<null>> => {
  try {
    const response = await authApi.delete<ApiEnvelope<null>>(
      `stocks/${tradeReservationId}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default deleteReservation;
