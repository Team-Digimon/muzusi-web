import News from "@/components/home/News";
import Rank from "@/components/home/Rank";
import styled from "styled-components";

const Home = () => {
  return (
    <Container>
      <News />
      <Rank />
    </Container>
  );
};

export default Home;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 56px;
`;
