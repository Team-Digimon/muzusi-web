import getAccountTransactions from "@/api/account/getAccountTransactions";
import getCurrentAccount from "@/api/account/getCurrentAccount";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import type { Transaction } from "@/types/account";

const AccountTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // 원래 "선택된 거래 없음"을 {}(빈 객체)로 표현했는데, 그 상태에서도
  // JSX가 transactionDetail.stockName 등을 참조해 타입이 안 맞았다.
  // "선택 없음"의 의미가 정확한 null로 바꿔서 옵셔널 체이닝으로 처리.
  const [transactionDetail, setTransactionDetail] =
    useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const currentTransactions = transactions.slice(
    currentPage * 10 - 10,
    currentPage * 10
  );
  const totalPages = Math.ceil(transactions.length / 10);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const openDetail = (transaction: Transaction) => () => {
    setTransactionDetail((prev) =>
      prev?.id === transaction.id ? null : transaction
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}. ${day}`;
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
  };

  const fetchAccountTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentAccount = await getCurrentAccount();
      const response = await getAccountTransactions(currentAccount.data.id);
      setTransactions(response.data.reverse());
    } catch (error) {
      console.error(
        "계좌 거래 내역 가오 실패: ",
        error instanceof globalThis.Error ? error.message : error
      );
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountTransactions();
  }, [fetchAccountTransactions]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <AccountTransactionsContainer>
      <Title>거래 내역</Title>

      <TransactionsContainer>
        <TransactionsInfo $isDetailOpen={transactionDetail !== null}>
          {currentTransactions.map((transaction, index) => {
            const formattedDate = formatDate(transaction.tradeAt);
            const prevFormattedDate =
              index > 0
                ? formatDate(currentTransactions[index - 1].tradeAt)
                : null;
            const isSelected = transactionDetail?.id === transaction.id;

            return (
              <Info
                key={transaction.id}
                onClick={openDetail(transaction)}
                $isSelected={isSelected}
              >
                <TradeInfo>
                  <TradeDate>
                    {formattedDate !== prevFormattedDate && formattedDate}
                  </TradeDate>
                  <TradeBody>
                    <StockName>{transaction.stockName}</StockName>
                    <TransactionType $type={transaction.tradeType === "BUY"}>
                      {transaction.tradeType === "BUY"
                        ? "구매완료"
                        : "판매완료"}
                      <StockCount>
                        &middot; {transaction.stockCount}주
                      </StockCount>
                    </TransactionType>
                  </TradeBody>
                </TradeInfo>
                <StockPrice>
                  {transaction.stockPrice.toLocaleString()}원
                </StockPrice>
              </Info>
            );
          })}
        </TransactionsInfo>
        {transactionDetail && (
          <TransactionDetail>
            <DetailStockName>{transactionDetail.stockName}</DetailStockName>
            <DetailType>
              {transactionDetail.tradeType === "BUY"
                ? "구매 완료"
                : "판매 완료"}
            </DetailType>
            <DetailLine>
              <DetailLabel>주문 시간</DetailLabel>
              <DetailInfo>
                {formatDateTime(transactionDetail.tradeAt)}
              </DetailInfo>
            </DetailLine>
            <DetailLine>
              <DetailLabel>1주 구매 가격</DetailLabel>
              <DetailInfo>
                {transactionDetail.stockPrice.toLocaleString()}원
              </DetailInfo>
            </DetailLine>
            <DetailLine>
              <DetailLabel>구매 수량</DetailLabel>
              <DetailInfo>{transactionDetail.stockCount}주</DetailInfo>
            </DetailLine>
            <DetailLine style={{ borderTop: "1px solid #001b371a" }}>
              <DetailLabel>총 구매 금액</DetailLabel>
              <DetailInfo>
                {(
                  transactionDetail.stockPrice * transactionDetail.stockCount
                ).toLocaleString()}
                원
              </DetailInfo>
            </DetailLine>
          </TransactionDetail>
        )}
      </TransactionsContainer>
      <PaginationContainer>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            $isActive={currentPage === i + 1}
          >
            {i + 1}
          </PageButton>
        ))}
      </PaginationContainer>
    </AccountTransactionsContainer>
  );
};

export default AccountTransactions;

const AccountTransactionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 24px;
  color: #333d4b;
  line-height: 1.45;
  margin-bottom: 24px;
`;

const TransactionsContainer = styled.div`
  display: flex;
  min-height: 500px;
  border-top: 1px solid #001b371a;
  border-bottom: 1px solid #001b371a;
  padding-bottom: 12px;
`;

const TransactionsInfo = styled.div<{ $isDetailOpen: boolean }>`
  display: flex;
  padding-top: 12px;
  padding-right: 12px;
  width: ${({ $isDetailOpen }) =>
    $isDetailOpen ? "calc(100% - 300px)" : "100%"};
  flex-direction: column;
  transition: 0.2s;
`;

const Info = styled.div<{ $isSelected: boolean }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: 8px;
  padding: 8px 0px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? "#f9fafb" : "transparent"};

  cursor: pointer;

  &:hover {
    background-color: #0220470d;
  }
`;

const TradeDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65px;
  color: #333d4b;
  line-height: 1.45px;
  font-weight: 500;
  font-size: 15px;
  margin-right: 10px;
`;

const TradeBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #4e5968;
  line-height: 1.45;
`;

const TransactionType = styled.div<{ $type: boolean }>`
  font-weight: 400;
  font-size: 14px;
  color: ${({ $type }) => ($type ? "#f04452" : "#3182f6")};
  line-height: 1.45;
`;

const StockCount = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #6b7684;
  line-height: 1.45;
`;

const TradeInfo = styled.div`
  display: flex;
`;

const StockPrice = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #4e5968;
  line-height: 1.45;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 20px;
`;

const TransactionDetail = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid #001b371a;
  padding: 12px;
  width: 300px;
`;

const DetailStockName = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: #4e5968;
  line-height: 1.45;
`;

const DetailType = styled.div`
  font-weight: 600;
  font-size: 17px;
  color: #191f28;
  line-height: 1.45;
  margin-bottom: 12px;
`;

const DetailLine = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.45;
  padding: 8px 0px;
`;

const DetailLabel = styled.span`
  color: #4e5968;
`;

const DetailInfo = styled.span`
  color: #333d4b;
`;

const PaginationContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.div<{ $isActive: boolean }>`
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
