import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Reservation } from "@/types/stock";

/** 체결 대기 중인 예약 주문 목록을 조회한다. */
const getReservations = async (): Promise<ApiEnvelope<Reservation[]>> => {
  try {
    const response = await authApi.get<ApiEnvelope<Reservation[]>>(
      `trades/reservations`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getReservations;
