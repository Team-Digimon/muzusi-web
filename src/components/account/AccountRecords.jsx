import getAccountRecords from "@/api/account/getAccountRecords";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

const AccountRecords = () => {
  const [accountRecords, setAccountRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccountRecords = async () => {
    try {
      const response = await getAccountRecords();
      setAccountRecords(response.data);
    } catch (error) {
      console.error("계좌 기록 불러오기 실패 : ", error.message);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountRecords();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <AccountRecordsContainer>
      <Title>전체 계좌 기록</Title>
      <RecordTable>
        <RecordThead>
          <RecordTheadTr>
            <RecordTheadTh style={{ width: "5%" }} />
            <RecordTheadTh style={{ width: "30%", justifyContent: "start" }}>
              일시
            </RecordTheadTh>
            <RecordTheadTh style={{ width: "30%" }}>최종 잔고</RecordTheadTh>
            <RecordTheadTh style={{ width: "30%" }}>수익률</RecordTheadTh>
            <RecordTheadTh style={{ width: "5%" }} />
          </RecordTheadTr>
        </RecordThead>
        <RecordTableContent>
          {accountRecords.map((el, index) => {
            const formattedBalance = el.balance.toLocaleString();
            const formattedDate = el.createdAt.split(".")[0].replace("T", " ");
            const change = ((el.balance - 10000000) / 10000000) * 100;
            return (
              <RecordTableAccount key={el.id} $isOdd={(index + 1) % 2 !== 0}>
                <AccountNumber>{index + 1}</AccountNumber>
                <AccountDate>{formattedDate}8</AccountDate>
                <AccountPrice>{formattedBalance}원</AccountPrice>
                <AccountChange $change={change}>{change}%</AccountChange>
              </RecordTableAccount>
            );
          })}
        </RecordTableContent>
      </RecordTable>
    </AccountRecordsContainer>
  );
};

export default AccountRecords;

const AccountRecordsContainer = styled.div`
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

const RecordTable = styled.table`
  display: table;
  border-collapse: separate;
  width: 100%;
  border-top: 1px solid #001b371a;
  margin-bottom: 20px;
`;

const RecordThead = styled.thead`
  width: 100%;
`;

const RecordTheadTr = styled.tr`
  display: flex;
  width: 100%;
`;

const RecordTheadTh = styled.th`
  color: #6b7684;
  display: flex;
  justify-content: end;
  align-items: center;
  font-weight: 500;
  min-height: 44px;
  font-size: 14px;
`;

const RecordTableContent = styled.tbody`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RecordTableAccount = styled.tr`
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

const AccountNumber = styled.th`
  display: flex;
  justify-content: center;
  width: 5%;
  font-weight: bold;
  color: #333d4b;
  line-height: 1.45;
  font-size: 15px;
`;

const AccountDate = styled.th`
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

const AccountPrice = styled.th`
  display: flex;
  justify-content: end;
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

const AccountChange = styled.th`
  display: flex;
  justify-content: end;
  width: 30%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.45;
  color: ${({ $change }) =>
    $change > 0 ? "#f04452" : $change < 0 ? "#3182f6" : "#4e5968"};
`;
