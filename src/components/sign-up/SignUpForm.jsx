import styled from "styled-components";
import MuzusiLogo from "@/assets/logo/MuzusiLogo.png";
import { useState } from "react";
import signUp from "@/api/auth/signUp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nickname, setNickname] = useState("");
  const [available, setAvailable] = useState(
    "2~8자의 한글, 영문, 숫자(공백, 특수문자 제외)"
  );
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNickname(value);

    const regex = /^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,8}$/;
    if (regex.test(value)) {
      setAvailable("사용 가능한 닉네임입니다.");
      setError("");
    } else if (!value) {
      setAvailable("2~8자의 한글, 영문, 숫자(공백, 특수문자 제외)");
      setError("");
    } else {
      setAvailable("");
      setError("닉네임 형식을 확인해주세요.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!error && nickname.length > 0) {
      try {
        const response = await signUp(nickname);
        if (response.code === 200) {
          console.log("닉네임 등록 성공", response);
          login({ token: response.data.accessToken });
          alert("닉네임 등록이 완료되었습니다.");
          navigate("/");
        } else {
          console.error("닉네임 등록 실패", response);
          setError("닉네임 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
      } catch (apiError) {
        if (apiError.reponse.status === 422) {
          alert("닉네임 형식을 확인해주세요.");
        }
        console.error("닉네임 등록 실패", apiError);
        setError("닉네임 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } else {
      setError("닉네임 형식을 확인해주세요.");
      setAvailable("");
    }
  };

  return (
    <SignUpFormContainer>
      <SignUpFormLogo href="/">
        <SignUpFormLogoImg
          alt="무주시"
          loading="lazy"
          decoding="async"
          src={MuzusiLogo}
        />
      </SignUpFormLogo>
      <SignUpText>무자본으로 시작하는 주식 시뮬레이션</SignUpText>

      <NicknameForm onSubmit={handleSubmit}>
        <NicknameText>닉네임</NicknameText>
        <NicknameInput
          value={nickname}
          onChange={handleInputChange}
          $hasError={!!error}
          placeholder="사용하실 닉네임을 입력해주세요."
        />
        {available && <AvailableText>{available}</AvailableText>}
        {error && <ErrorText>{error}</ErrorText>}
        <NicknameBtns>
          <SubmitBtn type="submit">확인</SubmitBtn>
          <SkipBtnContainer>
            <SkipBtn href="/">건너뛰기&gt;</SkipBtn>
          </SkipBtnContainer>
        </NicknameBtns>
      </NicknameForm>
    </SignUpFormContainer>
  );
};

export default SignUpForm;

const SignUpFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 450px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 10px 60px 2px rgba(0, 0, 0, 0.1);
  margin: auto;
  padding: 80px 50px 60px 50px;
`;

const SignUpText = styled.div`
  color: #747474;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  margin: 0 auto;
`;

const SignUpFormLogo = styled.a`
  margin: 0 auto;
`;

const SignUpFormLogoImg = styled.img`
  width: 200px;
  height: auto;
  border: none;
  background: none;
`;

const NicknameText = styled.div`
  width: 100%;
  text-align: left;
  font-size: 20px;
  font-weight: 600;
  padding: 5px;
`;

const NicknameForm = styled.form`
  display: flex;
  width: 80%;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const NicknameInput = styled.input`
  width: 100%;
  height: 60px;
  padding: 8px 12px;
  border: 2px solid ${({ $hasError }) => ($hasError ? "#FF0000" : "#000")};
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;
  font-family: pretendard;
  outline: none;
  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? "#FF0000" : "#000")};
  }
  &::placeholder {
    color: #aaaaaa;
    font-weight: 400;
  }
`;

const AvailableText = styled.div`
  width: 100%;
  font-size: 14px;
  padding-left: 5px;
`;

const ErrorText = styled.div`
  width: 100%;
  color: #ff0000;
  font-size: 14px;
  padding-left: 5px;
`;

const NicknameBtns = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 50px;
  background-color: #000;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  font-family: pretendard;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #000;
    border-color: #000;
  }
`;

const SkipBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  padding-right: 5px;
`;

const SkipBtn = styled.a`
  text-decoration: none;
  color: #cccccc;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
