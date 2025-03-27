import createAccount from "@/api/account/createAccount";
import getCurrentAccount from "@/api/account/getCurrentAccount";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import AccountChart from "@/components/account/AccountChart";

const CurrentAccount = () => {
  const [currentAccount, setCurrentAccount] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const openCheckModal = () => {
    setIsCheckModalOpen(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsCheckModalOpen(false);
    setIsModalOpen(false);
  };

  const fetchCurrentAccount = async () => {
    try {
      const response = await getCurrentAccount();
      setCurrentAccount(response.data);
    } catch (error) {
      console.error("현재 계좌 가져오기 실패 : ", error.message);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickCreateBtn = async () => {
    const now = new Date();
    const koreaTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      hour: "numeric",
      hour12: false,
    }).format(now);

    if (koreaTime > 9) {
      setErrorMessage("00:00 ~ 09:00 사이에만 가능합니다.");
      openModal();
      return;
    }

    try {
      await createAccount();
      openModal();
    } catch (error) {
      if (error.code === "4003") {
        alert(error.message);
        setErrorMessage(error.message);
      } else {
        setErrorMessage(error.message);
      }
      openModal();
      console.error("계좌 생성 실패 : ", error.message);
    }
  };

  const currentTotalBalance =
    currentAccount.balance +
    (typeof currentAccount.totalEvaluatedAmount === "number"
      ? currentAccount.totalEvaluatedAmount
      : 0);
  const accountProfits = currentAccount?.accountProfits || [];
  const hasEnoughData = accountProfits.length >= 2;

  const previousBalance = hasEnoughData ? accountProfits[1].totalBalance : 0;

  const balanceChange = currentTotalBalance - previousBalance;
  const balanceChangeRate = previousBalance
    ? ((balanceChange / previousBalance) * 100).toFixed(2)
    : "0.00";

  useEffect(() => {
    fetchCurrentAccount();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <CurrentAccountContainer>
      <BalanceContainer>
        <BalanceHeader>
          <Title>현재 내 자산</Title>
          <CreateAccountBtn onClick={openCheckModal}>
            초기화 및 계좌 재생성
          </CreateAccountBtn>
        </BalanceHeader>
        <Balance>{currentTotalBalance.toLocaleString()} 원</Balance>
        {hasEnoughData ? (
          <BalanceChange>
            이 전날보다{" "}
            <BalanceChangeRate $change={balanceChange}>
              {balanceChange > 0 ? "+" : ""}
              {balanceChange.toLocaleString()}({balanceChangeRate}%)
            </BalanceChangeRate>
          </BalanceChange>
        ) : null}
      </BalanceContainer>
      <AccountChart chartData={currentAccount.accountProfits} />
      <AssetsContainer>
        <AssetContainer>
          <Title>주문 가능 금액</Title>
          <AvailableBalance>
            {currentAccount.balance.toLocaleString()} 원
          </AvailableBalance>
        </AssetContainer>
        <AssetContainer>
          <Title>투자 중인 금액</Title>
          <AvailableBalance>
            {currentAccount.totalEvaluatedAmount.toLocaleString()}원
            <Return $return={currentAccount.totalProfitAmount}>
              {currentAccount.totalProfitAmount >= 0
                ? `+ ${currentAccount.totalProfitAmount.toLocaleString()}`
                : `- ${Math.abs(
                    currentAccount.totalProfitAmount
                  ).toLocaleString()}`}
              원 ({Math.abs(currentAccount.totalRateOfReturn)}%)
            </Return>
          </AvailableBalance>
        </AssetContainer>
      </AssetsContainer>
      {isCheckModalOpen && (
        <ModalBackground onClick={closeModals}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {isModalOpen ? (
              <CheckTitle>
                {errorMessage ? errorMessage : "계좌가 초기화되었습니다."}
              </CheckTitle>
            ) : (
              <>
                <CheckTitle>계좌를 초기화 및 재생성하시겠습니까?</CheckTitle>
                <CheckBtnContainer>
                  <CheckBtn onClick={closeModals}>&lt; 뒤로</CheckBtn>
                  <ModalBtn onClick={handleClickCreateBtn}>
                    초기화 및 재생성
                  </ModalBtn>
                </CheckBtnContainer>
              </>
            )}
          </ModalContent>
        </ModalBackground>
      )}
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

const BalanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: normal;
  font-size: 15px;
  color: #4e5968;
  line-height: 1.45;
`;

const CreateAccountBtn = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 2px 12px;
  color: #333d4b;
  border-radius: 8px;
  border: 1px solid #333d4b;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    color: #fff;
    background: #000;
    border: 1px solid #000;
  }
`;

const Balance = styled.div`
  font-weight: 600;
  color: #333d4b;
  line-height: 1.45;
  font-size: 24px;
`;

const BalanceChange = styled.div`
  font-weight: 500;
  color: #4e5968;
  font-size: 15px;
  line-height: 1.45;
`;

const BalanceChangeRate = styled.span`
  color: ${({ $change }) =>
    $change > 0 ? "#f04452" : $change < 0 ? "#3182f6" : "#4e5968"};
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
`;

const AvailableBalance = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: #333d4b;
  line-height: 1.45;
  font-size: 20px;
`;

const Return = styled.div`
  display: flex;
  font-weight: normal;
  line-height: 1.45;
  font-size: 14px;
  color: ${({ $return }) =>
    $return > 0 ? "#f04452" : $return < 0 ? "#3182f6" : "#4e5968"};
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

const CheckTitle = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.45;
  color: #444d4b;
`;

const CheckBtnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const ModalBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 20px;
  background: #000;
  color: #fff;
  font-weight: 600;
  line-height: 1.45;
  font-size: 14px;
  padding: 5px;
  margin-top: 15px;
  border: 1px solid #000;
  cursor: pointer;
`;

const CheckBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 20px;
  background: #fff;
  color: #000;
  font-weight: 600;
  line-height: 1.45;
  font-size: 14px;
  padding: 5px;
  margin-top: 15px;
  border: 1px solid #000;
  cursor: pointer;
`;
