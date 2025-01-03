import styled from "styled-components";
import SignInForm from "../components/sign-in/SignInForm";

const SignIn = () => {
  return (
    <Container>
      <ContentContainer>
        <SignInForm />
      </ContentContainer>
    </Container>
  );
};

export default SignIn;

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
