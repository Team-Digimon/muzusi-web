import getCurrentAccount from "@/api/account/getCurrentAccount";
import { useEffect, useState } from "react";
import styled from "styled-components";

const CurrentAccount = () => {
  const [currentAccount, setCurrentAccount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalAsset = currentAccount.balance + currentAccount.reservedPrice;

  const fetchCurrentAccount = async () => {
    try {
      const response = await getCurrentAccount();
      console.log(response);
      setCurrentAccount(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("현재 계좌 가져오기 실패 : ", error.message);
    }
  };

  useEffect(() => {
    fetchCurrentAccount();
  }, []);

  if (isLoading) return null;

  return (
    <CurrentAccountContainer>
      <BalanceContainer>
        <Title>현재 내 자산</Title>
        <Balance>{totalAsset.toLocaleString()} 원</Balance>
      </BalanceContainer>
      <AssetsContainer>
        <AssetContainer>
          <Title>주문 가능 금액</Title>
          <AvailableBalance>
            {currentAccount.balance.toLocaleString()} 원
          </AvailableBalance>
        </AssetContainer>
        <AssetContainer>
          <Title>투자 중인 금액</Title>
          <AvailableBalance>- 원</AvailableBalance>
        </AssetContainer>
      </AssetsContainer>
    </CurrentAccountContainer>
  );
};

export default CurrentAccount;

const CurrentAccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const BalanceContainer = styled.div``;

const Title = styled.div`
  font-weight: normal;
  font-size: 15px;
  color: #4e5968;
  line-height: 1.45;
`;

const Balance = styled.div`
  font-weight: 600;
  color: #333d4b;
  line-height: 1.45;
  font-size: 24px;
`;

const AssetsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const AssetContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 270px;
  height: 100%;
  padding: 20px 24px;
  background: #f9fafb;
  border-radius: 15px;
  gap: 12px;
`;

const AvailableBalance = styled.div`
  font-weight: 600;
  color: #333d4b;
  line-height: 1.45;
  font-size: 20px;
`;
