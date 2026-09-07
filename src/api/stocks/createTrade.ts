import authApi from "@/api/authApi";
import { handleApiErrorWithPayload } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { CreateTradeData } from "@/types/stock";

/**
 * 매수/매도 주문을 생성한다. 즉시 체결 가능한 가격이면 바로 체결되고,
 * 아니면 예약 주문으로 등록돼 `getReservations`로 조회·`deleteReservation`으로
 * 취소할 수 있다.
 */
const createTrade = async ({
  data,
}: {
  data: CreateTradeData;
}): Promise<ApiEnvelope<null>> => {
  try {
    const response = await authApi.post<ApiEnvelope<null>>(`stocks`, data);
    return response.data;
  } catch (error) {
    return handleApiErrorWithPayload(error);
  }
};

export default createTrade;
