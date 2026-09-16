import createAccount from "@/api/account/createAccount";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import AccountChart from "@/components/account/AccountChart";
import { isApiErrorPayload } from "@/types/api";
import useCurrentAccount from "@/hooks/useCurrentAccount";
import { accountQueryKeys } from "@/hooks/queryKeys";

const CurrentAccount = () => {
  const { data: currentAccount, isPending, error } = useCurrentAccount();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleClickCreateBtn = async () => {
    const now = new Date();
    const koreaTime = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul",
        hour: "numeric",
        hour12: false,
      }).format(now)
    );

    if (koreaTime > 9) {
      setErrorMessage("00:00 ~ 09:00 사이에만 가능합니다.");
      openModal();
      return;
    }

    try {
      await createAccount();
      // 원래는 여기서 캐시/상태를 갱신하는 코드가 없어서, 재생성 성공
      // 모달을 닫아도 화면엔 예전 계좌 정보가 그대로 남아있었다(새로고침
      // 해야 반영됨). invalidateQueries로 "currentAccount" 쿼리를
      // 무효화하면, 이 캐시를 쓰는 모든 컴포넌트(StockTrade 등 포함)가
      // 자동으로 최신 데이터를 다시 받아온다.
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.current });
      openModal();
    } catch (error) {
      const message = isApiErrorPayload(error)
        ? error.message
        : error instanceof globalThis.Error
        ? error.message
        : "계좌 생성 중 오류가 발생했습니다.";

      if (isApiErrorPayload(error) && error.code === "4003") {
        alert(message);
      }
      setErrorMessage(message);
      openModal();
      console.error("계좌 생성 실패 : ", message);
    }
  };

  const currentTotalBalance =
    (currentAccount?.balance ?? 0) +
    (typeof currentAccount?.totalEvaluatedAmount === "number"
      ? currentAccount.totalEvaluatedAmount
      : 0);
  const accountProfits = currentAccount?.accountProfits || [];
  const hasEnoughData = accountProfits.length >= 2;

  const previousBalance = hasEnoughData ? accountProfits[1].totalBalance : 0;
  const updatedAccountProfits =
    accountProfits.length > 0
      ? [
          {
            ...accountProfits[0],
            totalBalance: currentTotalBalance,
          },
          ...accountProfits.slice(1),
        ]
      : [];

  const balanceChange = currentTotalBalance - previousBalance;
  const balanceChangeRate = previousBalance
    ? ((balanceChange / previousBalance) * 100).toFixed(2)
    : "0.00";

  if (isPending) return <Loading />;
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
      <AccountChart chartData={updatedAccountProfits} />
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
  color: var(--color-neutral);
  line-height: 1.45;
`;

const CreateAccountBtn = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 2px 12px;
  color: var(--color-ink);
  border-radius: 8px;
  border: 1px solid var(--color-ink);
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    color: var(--color-on-primary);
    background: var(--color-primary);
    border: 1px solid var(--color-primary);
  }
`;

const Balance = styled.div`
  font-weight: 600;
  color: var(--color-ink);
  line-height: 1.45;
  font-size: 24px;
`;

const BalanceChange = styled.div`
  font-weight: 500;
  color: var(--color-neutral);
  font-size: 15px;
  line-height: 1.45;
`;

const BalanceChangeRate = styled.span<{ $change: number }>`
  color: ${({ $change }) =>
    $change > 0 ? "var(--color-up)" : $change < 0 ? "var(--color-down)" : "var(--color-neutral)"};
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
  background: var(--color-canvas-soft);
  border-radius: 15px;
`;

const AvailableBalance = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: var(--color-ink);
  line-height: 1.45;
  font-size: 20px;
`;

const Return = styled.div<{ $return: number }>`
  display: flex;
  font-weight: normal;
  line-height: 1.45;
  font-size: 14px;
  color: ${({ $return }) =>
    $return > 0 ? "var(--color-up)" : $return < 0 ? "var(--color-down)" : "var(--color-neutral)"};
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
  background: var(--color-canvas);
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
  color: var(--color-ink);
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
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 600;
  line-height: 1.45;
  font-size: 14px;
  padding: 5px;
  margin-top: 15px;
  border: 1px solid var(--color-primary);
  cursor: pointer;
`;

const CheckBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 20px;
  background: var(--color-on-primary);
  color: var(--color-primary);
  font-weight: 600;
  line-height: 1.45;
  font-size: 14px;
  padding: 5px;
  margin-top: 15px;
  border: 1px solid var(--color-primary);
  cursor: pointer;
`;
