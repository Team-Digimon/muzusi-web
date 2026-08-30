import AccountTransactions from "@/components/account/AccountTransactions";
import styled from "styled-components";

const Transactions = () => {
  return (
    <TransactionsContainer>
      <AccountTransactions />
    </TransactionsContainer>
  );
};

export default Transactions;

const TransactionsContainer = styled.div``;
