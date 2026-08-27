const isTradingTime = () => {
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
