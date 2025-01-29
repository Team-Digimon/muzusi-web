import getStocksRank from "@/api/stocks/getStocksRank";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const Rank = () => {
  const [rank, setRank] = useState([]);
  const [type, setType] = useState("VOLUME");
  const [time, setTime] = useState("");
  const [page, setPage] = useState(0);

  const types = [
    { value: "VOLUME", korean: "거래량" },
    { value: "RISING", korean: "급상승" },
    { value: "FALLING", korean: "급하락" },
  ];

  const fetchRank = useCallback(async () => {
    try {
      const response = await getStocksRank({
        type: type,
      });
      setRank(response.data.rank);
      setTime(response.data.time);
    } catch (error) {
      console.error("주식 순위 가져오기 실패: ", error.message);
    }
  }, [type]);

  useEffect(() => {
    fetchRank();
  }, [fetchRank]);

  const handleType = (type) => () => {
    setType(type);
    setPage(0);
  };

  const handlePage = (pageNumber) => () => {
    setPage(pageNumber - 1);
  };

  return (
    <RankContainer>
      <RankHeader>
        <RankTitle>실시간 TOP 30 차트</RankTitle>
        <RankTime>{time} 기준</RankTime>
      </RankHeader>
      <RankTypes>
        {types.map((el, index) => {
          return (
            <RankType
              key={index}
              onClick={handleType(el.value)}
              $isActive={type === el.value}
            >
              {el.korean}
            </RankType>
          );
        })}
      </RankTypes>
      <RankTable>
        <RankThead>
          <RankTheadTr>
            <RankTheadTh style={{ width: "5%" }} />
            <RankTheadTh style={{ width: "30%", justifyContent: "start" }}>
              종목
            </RankTheadTh>
            <RankTheadTh style={{ width: "10%" }}>현재가</RankTheadTh>
            <RankTheadTh style={{ width: "25%" }}>등락률</RankTheadTh>
            <RankTheadTh style={{ width: "25%" }}>거래량</RankTheadTh>
            <RankTheadTh style={{ width: "5%" }} />
          </RankTheadTr>
        </RankThead>
        <RankTableContent>
          {rank.slice(page * 10, page * 10 + 10).map((el) => {
            const formattedPrice = el.price.toLocaleString();
            const formattedPrdyVrss = el.prdyVrss.toLocaleString();
            const adjustedPrdyCtrt =
              el.prdyCtrt < 0 ? Math.abs(el.prdyCtrt) : el.prdyCtrt;
            const formattedAvrgVol = el.avrgVol.toLocaleString();
            return (
              <RankTableStock key={el.rank} $isOdd={el.rank % 2 !== 0}>
                <StockRanking>{el.rank}</StockRanking>
                <StockName>{el.name}</StockName>
                <StockPrice>{formattedPrice}원</StockPrice>
                <StockCtrt $prdyVrss={el.prdyVrss}>
                  {formattedPrdyVrss}원({adjustedPrdyCtrt}%)
                </StockCtrt>
                <StockAvrgVol>{formattedAvrgVol}주</StockAvrgVol>
              </RankTableStock>
            );
          })}
        </RankTableContent>
      </RankTable>
      <RankTablePageController>
        <PageBtns>
          {Array.from({ length: 3 }, (_, index) => (
            <PageBtn
              key={index}
              onClick={handlePage(index + 1)}
              $isActive={page === index}
            >
              {index + 1}
            </PageBtn>
          ))}
        </PageBtns>
      </RankTablePageController>
    </RankContainer>
  );
};

export default Rank;

const RankContainer = styled.section`
  width: 100%;
  margin-bottom: 80px;
`;

const RankHeader = styled.header`
  display: flex;
  align-items: center;
`;

const RankTitle = styled.span`
  font-weight: bold;
  color: #333d4b;
  font-size: 20px;
  line-height: 1.45;
  margin-right: 16px;
`;

const RankTime = styled.span`
  font-weight: normal;
  color: #6b7684;
  font-size: 14px;
  line-height: 1.45;
`;

const RankTypes = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  gap: 20px;
`;

const RankType = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  font-weight: 600;
  font-size: 17px;
  line-height: 1.45;
  cursor: pointer;
  color: ${({ $isActive }) => ($isActive ? "#000" : "#4e5968")};
  border-bottom: ${({ $isActive }) => ($isActive ? "2px solid #000" : "none")};
`;

const RankTable = styled.table`
  display: table;
  border-collapse: separate;
  width: 100%;
  border-top: 1px solid #001b371a;
  margin-bottom: 20px;
`;

const RankThead = styled.thead`
  width: 100%;
`;

const RankTheadTr = styled.tr`
  display: flex;
  width: 100%;
`;

const RankTheadTh = styled.th`
  color: #6b7684;
  display: flex;
  justify-content: end;
  align-items: center;
  font-weight: 500;
  min-height: 44px;
  font-size: 14px;
`;

const RankTableContent = styled.tbody`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RankTableStock = styled.tr`
  display: flex;
  width: 100%;
  height: 56px;
  align-items: center;
  cursor: pointer;
  background: ${({ $isOdd }) => ($isOdd ? "#f9f9f9" : "#ffffff")};
  &:hover {
    background: #0220470d;
  }
`;

const StockRanking = styled.th`
  display: flex;
  justify-content: center;
  width: 5%;
  font-weight: bold;
  color: #333d4b;
  line-height: 1.45;
  font-size: 15px;
`;

const StockName = styled.th`
  display: flex;
  width: 30%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.45;
  color: #4e5968;
`;

const StockPrice = styled.th`
  display: flex;
  justify-content: end;
  width: 10%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.45;
  color: #4e5968;
`;

const StockCtrt = styled.th`
  display: flex;
  justify-content: end;
  width: 25%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.45;
  color: ${({ $prdyVrss }) =>
    $prdyVrss > 0 ? "#f04452" : $prdyVrss < 0 ? "#3182f6" : "#4e5968"};
`;

const StockAvrgVol = styled.th`
  display: flex;
  justify-content: end;
  width: 25%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.45;
  color: #4e5968;
`;

const RankTablePageController = styled.nav`
  display: flex;
  justify-content: center;
`;

const PageBtns = styled.ul`
  display: flex;
  gap: 5px;
`;

const PageBtn = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  height: 36px;
  min-width: 36px;
  padding: 0px 6px;
  border-radius: 18px;
  font-size: 17px;
  color: #6b7684;
  font-weight: 600;
  line-height: 1.15;
  cursor: pointer;
  color: ${({ $isActive }) => ($isActive ? "#333d4b" : "#6b7684")};
  background: ${({ $isActive }) => ($isActive ? "#001B371A" : "none")};
  &:hover {
    background: #0220470d;
  }
`;
