import styled from "styled-components";
import SignUpForm from "../components/auth/SignUpForm";

const SignUp = () => {
  return (
    <Container>
      <ContentContainer>
        <SignUpForm />
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  background: linear-gradient(to bottom, #bbbbbb, white);
  height: 50vh;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 56px);
  height: 100vh;
`;
export default SignUp;
