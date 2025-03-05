import getReservations from "@/api/stocks/getReservations";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import MuLogo from "@/assets/logo/MuLogo.webp";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getReservations();
      setReservations(response.data);
    } catch (error) {
      console.error("보유 주식 가져오기 실패: ", error.message);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return reservations.length > 0 ? (
    <ReservationsContainer>
      {reservations.map((reservation) => {
        return (
          <HoldingReservation key={reservation.id}>
            <ReservationInfo>
              <ReservationName>{reservation.stockName}</ReservationName>
              <ReservationPrice>
                {reservation.inputPrice.toLocaleString()}
              </ReservationPrice>
            </ReservationInfo>
            <ReservationInfo>
              <ReservationCount>{reservation.stockCount}주</ReservationCount>
              <ReservationType $type={reservation.tradeType === "BUY"}>
                {reservation.tradeType === "BUY" ? "구매 대기" : "판매 대기"}
              </ReservationType>
            </ReservationInfo>
          </HoldingReservation>
        );
      })}
    </ReservationsContainer>
  ) : (
    <NoticeContainer>
      <Logo src={MuLogo} alt="MuLogo" />
      <NoticeDescription>예약된 주문이 없습니다.</NoticeDescription>
    </NoticeContainer>
  );
};

export default Reservations;

const ReservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HoldingReservation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 10px;

  &:hover {
    background-color: #021f470d;
  }
`;

const ReservationInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const ReservationName = styled.span`
  font-weight: 500;
  color: #4e5968;
  line-height: 1.45;
  font-size: 14px;
`;

const ReservationPrice = styled.span`
  font-weight: 600;
  color: #333d4b;
  line-height: 1.45;
  font-size: 14px;
`;

const ReservationCount = styled.span`
  font-weight: 500;
  color: #6b7684;
  line-height: 1.45;
  font-size: 12px;
`;

const ReservationType = styled.span`
  font-weight: 500;
  line-height: 1.45;
  font-size: 12px;
  color: ${({ $type }) => ($type ? "#f04452" : "#3182f6")};
`;

const NoticeContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
`;

const NoticeDescription = styled.div`
  font-size: 15px;
  font-weight: 600;
`;
