/**
 * 지금이 국내 주식 장중 시간대인지 판별한다. 평일(월~금)
 * 09:00~15:30(양 끝 경계 포함)만 장중으로 취급하며, 공휴일은
 * 고려하지 않는다. `useStockSocket`이 이 함수를 기준으로 웹소켓
 * 연결 여부를 결정하고, `LiveStockPrice`가 장마감 안내를 표시할지
 * 판단하는 데도 쓴다.
 */
const isTradingTime = (): boolean => {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return (
    day >= 1 &&
    day <= 5 &&
    ((hours === 9 && minutes >= 0) ||
      (hours > 9 && (hours < 15 || (hours === 15 && minutes <= 30))))
  );
};

export default isTradingTime;
