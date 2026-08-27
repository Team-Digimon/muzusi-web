import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Reservation } from "@/types/stock";

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
