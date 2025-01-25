import News from "@/components/home/News";
import styled from "styled-components";

const Home = () => {
  return (
    <Container>
      <News />
    </Container>
  );
};

export default Home;

const Container = styled.section`
  display: flex;
  width: 100%;
  margin-top: 56px;
`;
