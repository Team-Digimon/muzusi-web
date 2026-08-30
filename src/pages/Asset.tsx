import CurrentAccount from "@/components/account/CurrentAccount";
import styled from "styled-components";

const Asset = () => {
  return (
    <AssetContainer>
      <CurrentAccount />
    </AssetContainer>
  );
};

export default Asset;

const AssetContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
