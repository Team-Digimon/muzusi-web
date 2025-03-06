import getReservations from "@/api/stocks/getReservations";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import MuLogo from "@/assets/logo/MuLogo.webp";
import PropTypes from "prop-types";
import deleteReservation from "@/api/stocks/deleteReservation";

const Reservations = ({ isModalOpen, setIsModalOpen }) => {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const openModal = (reservationData) => () => {
    setIsModalOpen(true);
    setReservation({
      id: reservationData.id,
      "주문 일시": formatDateTime(reservationData.createdAt),
      "주문 유형":
        reservationData.tradeType === "BUY" ? "매수 예약" : "매도 예약",
      종목명: reservationData.stockName,
      "종목 코드": reservationData.stockCode,
      "1 주당 가격": `${reservationData.inputPrice.toLocaleString()}원`,
      "주문 개수": `${reservationData.stockCount.toLocaleString()}주`,
      "총 주문 가격": `${(
        reservationData.inputPrice * reservationData.stockCount
      ).toLocaleString()}원`,
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReservation(null);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
  };

  const deleteHandler = async () => {
    if (!reservation?.id) return;

    try {
      await deleteReservation({ tradeReservationId: reservation.id });
      closeModal();
      fetchReservations();
    } catch (error) {
      console.error("예약 취소 실패:", error);
    }
  };

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
          <HoldingReservation
            key={reservation.id}
            onClick={openModal(reservation)}
          >
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
      {isModalOpen && reservation && (
        <ModalBackground onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>예약된 주문</ModalTitle>
            {Object.entries(reservation)
              .filter(([key]) => key !== "id")
              .map(([label, value], index) => (
                <ModalLine key={index}>
                  <ModalLabel>{label}</ModalLabel>
                  <ModalInfo>{value}</ModalInfo>
                </ModalLine>
              ))}
            <ModalBtn onClick={deleteHandler}>주문 취소하기</ModalBtn>
          </ModalContent>
        </ModalBackground>
      )}
    </ReservationsContainer>
  ) : (
    <NoticeContainer>
      <Logo src={MuLogo} alt="MuLogo" />
      <NoticeDescription>예약된 주문이 없습니다.</NoticeDescription>
    </NoticeContainer>
  );
};

Reservations.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
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
  cursor: pointer;

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

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  min-width: 300px;
  max-height: 500px;
  padding: 15px;
  margin-bottom: 200px;
`;

const ModalTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 1.45;
  color: #333d4b;
  margin-bottom: 10px;
`;

const ModalLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const ModalLabel = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 1.45;
  color: #333d4b;
`;

const ModalInfo = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 1.45;
  color: #6b7684;
`;

const ModalBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
  background: #000;
  color: #fff;
  font-weight: 600;
  line-height: 1.45;
  font-size: 14px;
  padding: 5px;
  margin-top: 15px;
  cursor: pointer;
`;
