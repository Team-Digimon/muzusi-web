import getAccountHoldings from "@/api/account/getAccountHoldings";
import getCurrentAccount from "@/api/account/getCurrentAccount";
import createTrade from "@/api/stocks/createTrade";
import useAuth from "@/contexts/useAuth";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styled from "styled-components";

const StockTrade = ({ stockData, currentPrice }) => {
  const { user } = useAuth();
  const [tradeType, setTradeType] = useState("BUY");
  const [priceType, setPriceType] = useState("지정가");
  const [inputPrice, setInputPrice] = useState("");
  const [inputCount, setInputCount] = useState("");
  const [isPriceFocused, setIsPriceFocused] = useState(false);
  const [isCountFocused, setIsCountFocused] = useState(false);
  const [holdings, setHoldings] = useState([]);
  const [balance, setBalance] = useState(0);

  const stock = stockData
    ? stockData
    : JSON.parse(sessionStorage.getItem("stockData"));

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const isTradingTime =
    (hours === 9 && minutes >= 0) ||
    (hours > 9 && (hours < 15 || (hours === 15 && minutes <= 30)));

  const currentHolding = holdings?.find(
    (holding) => holding.stockName === stock.stockName
  );
  const holdingCount = currentHolding ? currentHolding.stockCount : 0;

  const fetchBalance = async () => {
    const response = await getCurrentAccount();
    setBalance(response.data.balance);
  };

  const fetchHoldings = async () => {
    const response = await getAccountHoldings();
    setHoldings(response.data);
  };

  useEffect(() => {
    if (user) {
      fetchHoldings();
      fetchBalance();
    }
  }, [user]);

  const tradeTypes = [
    {
      value: "BUY",
      korean: "매수",
      color: "#f04452",
      hoverColor: "#e42939",
      label: "구매",
    },
    {
      value: "SELL",
      korean: "매도",
      color: "#3182f6",
      hoverColor: "#2272eb",
      label: "판매",
    },
  ];

  const priceTypes = ["지정가", "시장가"];

  const activeTradeIndex = tradeTypes.findIndex((el) => el.value === tradeType);
  const activePriceIndex = priceTypes.findIndex((el) => el === priceType);

  const handleTradeType = (type) => () => {
    setTradeType(type);
  };

  const handlePriceType = (type) => () => {
    setPriceType(type);
    if (type === "시장가") {
      setInputPrice("");
    }
  };

  const handleInputPriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputPrice(value);
    setInputCount("1");
  };

  const formatPriceDisplay = () => {
    return inputPrice ? parseInt(inputPrice, 10).toLocaleString() + " 원" : "";
  };

  const handleInputCountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputCount(value);
  };

  const formatCountDisplay = () => {
    return inputCount ? parseInt(inputCount, 10).toLocaleString() + " 주" : "";
  };

  const totalPrice =
    (user && priceType === "시장가" ? currentPrice : inputPrice) * inputCount ||
    0;

  const tradeStocks = async (data) => {
    if (!isTradingTime) {
      alert("주문 가능 시간이 아닙니다. (9:00 ~ 15:30)");
      return;
    }
    try {
      const response = await createTrade({ data: data });
      if (response.code === 200) {
        if (
          (data.tradeType === "BUY" && data.stockPrice > data.inputPrice) ||
          (data.tradeType === "SELL" && data.stockPrice < data.inputPrice)
        )
          alert("정상적으로 주문이 예약되었습니다.");
        else {
          alert("정상적으로 주문이 처리되었습니다.");
        }
        fetchHoldings();
        fetchBalance();
      }
    } catch (error) {
      console.error("주문 실패: ", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCount || inputCount <= 0) {
      alert("수량을 입력해주세요.");
      return;
    }
    if (priceType === "지정가" && (!inputPrice || inputPrice <= 0)) {
      alert("가격을 입력해주세요.");
      return;
    }

    const data = {
      stockPrice: currentPrice,
      inputPrice: inputPrice ? inputPrice : currentPrice,
      stockCount: inputCount,
      stockName: stock.stockName,
      stockCode: stock.stockCode,
      tradeType: tradeType,
    };

    tradeStocks(data);
  };

  return (
    <StockTradeContainer>
      <TradeTitle>주문하기</TradeTitle>
      <TradeTypes>
        <TradeHighlight $index={activeTradeIndex} />
        {tradeTypes.map((el, index) => {
          return (
            <TradeType
              key={index}
              onClick={handleTradeType(el.value)}
              $color={el.color}
              $isActive={tradeType === el.value}
            >
              {el.korean}
            </TradeType>
          );
        })}
      </TradeTypes>
      <TradeOrderForm>
        <OrderLine>
          <OrderLabel>{tradeTypes[activeTradeIndex].label} 가격</OrderLabel>
          <PriceTypes>
            <PriceHighlight $index={activePriceIndex} />
            {priceTypes.map((el, index) => {
              return (
                <PriceType
                  key={index}
                  onClick={handlePriceType(el)}
                  $isActive={priceType === el}
                >
                  {el}
                </PriceType>
              );
            })}
          </PriceTypes>
        </OrderLine>
        <OrderLine>
          <OrderLabel />
          {priceType === "지정가" ? (
            <OrderInput
              type="text"
              value={isPriceFocused ? inputPrice : formatPriceDisplay()}
              onChange={handleInputPriceChange}
              placeholder="가격 입력"
              onFocus={() => setIsPriceFocused(true)}
              onBlur={() => setIsPriceFocused(false)}
            />
          ) : (
            <OrderDisableInput>최대한 빠른 가격</OrderDisableInput>
          )}
        </OrderLine>
        <OrderLine>
          <OrderLabel>수량</OrderLabel>
          <OrderInput
            type="text"
            value={isCountFocused ? inputCount : formatCountDisplay()}
            onChange={handleInputCountChange}
            placeholder="수량 입력"
            onFocus={() => setIsCountFocused(true)}
            onBlur={() => setIsCountFocused(false)}
          />
        </OrderLine>
        <OrderInfoContainer>
          <OrderInfo>
            <OrderInfoSpan>
              {tradeTypes[activeTradeIndex].label} 가능{" "}
              {tradeTypes[activeTradeIndex].label === "구매" ? "금액" : "개수"}
            </OrderInfoSpan>
            <OrderInfoSpan>
              {tradeTypes[activeTradeIndex].label === "구매"
                ? `${balance.toLocaleString()} 원`
                : `${holdingCount.toLocaleString()} 주`}
            </OrderInfoSpan>
          </OrderInfo>
          <OrderInfo>
            <OrderInfoSpan>총 주문 금액</OrderInfoSpan>
            <OrderInfoSpan>{totalPrice.toLocaleString()} 원</OrderInfoSpan>
          </OrderInfo>
        </OrderInfoContainer>
        <TradeBtn
          type="submit"
          onClick={handleSubmit}
          disabled={
            !user ||
            (tradeTypes[activeTradeIndex].label === "판매" &&
              holdingCount === 0)
          }
          $color={tradeTypes[activeTradeIndex].color}
          $hoverColor={tradeTypes[activeTradeIndex].hoverColor}
        >
          {!user
            ? `로그인하고 ${tradeTypes[activeTradeIndex].label}하기`
            : tradeTypes[activeTradeIndex].label === "판매" &&
              holdingCount === 0
            ? "보유하지 않은 종목입니다."
            : `${tradeTypes[activeTradeIndex].label} 예약하기`}
        </TradeBtn>
      </TradeOrderForm>
    </StockTradeContainer>
  );
};

StockTrade.propTypes = {
  stockData: PropTypes.shape({
    stockName: PropTypes.string.isRequired,
    stockCode: PropTypes.string.isRequired,
  }),
  currentPrice: PropTypes.number.isRequired,
};

export default StockTrade;

const StockTradeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  gap: 8px;
  margin-top: 48px;
  height: 500px;
  position: relative;
`;

const TradeTitle = styled.div`
  font-weight: bold;
  line-height: 1.45;
  font-size: 14px;
  color: #333d4b;
`;

const TradeTypes = styled.div`
  display: flex;
  padding: 2px;
  border-radius: 8px;
  justify-content: space-evenly;
  align-items: center;
  height: 32px;
  background: #0220470d;
  position: relative;
  margin-bottom: 5px;
`;

const TradeHighlight = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(50% - 2px);
  height: calc(100% - 4px);
  background: white;
  border-radius: 6px;
  box-shadow: #001b370a 0px 1px 3px 0px;
  transition: transform 0.4s ease-in-out;
  transform: ${({ $index }) => `translateX(${100 * $index}% )`};
`;

const TradeType = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  line-height: 1.45;
  font-size: 14px;
  color: ${({ $isActive, $color }) => ($isActive ? $color : "#4e5968")};
  width: 50%;
  height: 100%;
  cursor: pointer;
  position: relative;
  transition: 0.2s;
`;

const PriceTypes = styled.div`
  display: flex;
  padding: 2px;
  border-radius: 8px;
  justify-content: space-evenly;
  align-items: center;
  height: 32px;
  background: #0220470d;
  position: relative;
  width: 100%;
`;

const PriceHighlight = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(50% - 2px);
  height: calc(100% - 4px);
  background: white;
  border-radius: 6px;
  box-shadow: #001b370a 0px 1px 3px 0px;
  transition: transform 0.4s ease-in-out;
  transform: ${({ $index }) => `translateX(${100 * $index}% )`};
`;

const PriceType = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  line-height: 1.45;
  font-size: 14px;
  color: ${({ $isActive, $color }) => ($isActive ? $color : "#4e5968")};
  width: 50%;
  height: 100%;
  cursor: pointer;
  position: relative;
  transition: 0.2s;
`;

const TradeOrderForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OrderLine = styled.div`
  display: flex;
  gap: 8px;
  padding: 0px 8px;
`;

const OrderLabel = styled.span`
  display: flex;
  align-items: center;
  line-height: 33px;
  min-width: 60px;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 600;
  color: #333d4b;
`;

const OrderInput = styled.input`
  font-family: pretendard;
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  border-radius: 8px;
  font-weight: 600;
  color: #000c4dcc;
  line-height: 20px;
  font-size: 14px;
  padding: 0px 14px;
  border: 1px solid #dddddd;
  transition: 0.1s;
  &:hover {
    border: 2px solid #000c4dcc;
  }
  &::placeholder {
    font-size: 13px;
    font-weight: 600;
  }
`;

const OrderDisableInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  border-radius: 8px;
  color: #03183275;
  line-height: 20px;
  font-size: 13px;
  font-weight: 600;
  padding: 0px 14px;
  background: #0220470d;
  border: 1px solid #dddddd;
`;

const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  margin-top: 70px;
  border-top: 2px solid #001b370a;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: #333d4b;
  font-size: 14px;
  line-height: 1.45px;
  margin: 15px 8px;
`;

const OrderInfoSpan = styled.span``;

const TradeBtn = styled.button`
  font-family: pretendard;
  min-height: 40px;
  font-weight: 600;
  text-align: center;
  font-size: 15px;
  line-height: 20px;
  vertical-align: middle;
  text-decoration: none;
  border-radius: 10px;
  background: ${({ disabled, $color }) => (disabled ? "#ccc" : $color)};
  color: #fff;
  transition: 0.2s;
  border: none;
  position: absolute;
  left: 0px;
  bottom: 20px;
  width: 100%;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${({ disabled, $hoverColor }) =>
      disabled ? "#ccc" : $hoverColor};
  }
`;
