import styled from "styled-components";

const SideBar = () => {
  return (
    <GlobalSideBar>
      <SideAnchor>
        <SideBtn>
          <SideIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fill="#B0B8C1"
                d="M12.902 8.306L9.91 5.669a.98.98 0 00-1.296 0l-6.082 5.36a.98.98 0 00-.332.735v7.482a1.96 1.96 0 001.96 1.96h15.68a1.96 1.96 0 001.96-1.96V3.776a.98.98 0 00-1.628-.735l-5.974 5.265a.98.98 0 01-1.296 0"
                fillRule="evenodd"
              ></path>
            </svg>
          </SideIcon>
        </SideBtn>
        <span>내 투자</span>
      </SideAnchor>
      <SideAnchor>
        <SideBtn>
          <SideIcon>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m10.904 21.288c.666.44 1.525.44 2.19 0 2.115-1.396 6.72-4.733 8.704-8.467 2.615-4.926-.456-9.839-4.516-9.839-2.314 0-3.706 1.209-4.476 2.248-.324.445-.947.544-1.393.22-.085-.061-.159-.136-.22-.22-.77-1.039-2.162-2.248-4.476-2.248-4.06 0-7.131 4.913-4.515 9.839 1.982 3.734 6.589 7.071 8.702 8.467"
                fill="#b0b8c1"
                fillRule="evenodd"
              />
            </svg>
          </SideIcon>
        </SideBtn>
        <span>관심</span>
      </SideAnchor>
    </GlobalSideBar>
  );
};

export default SideBar;

const GlobalSideBar = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f7f9;
  border-left: 1px solid #001b371a;
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 0 24px;
  width: 56px;
  height: 100dvh;
  overflow: auto;
  z-index: 1;
`;

const SideAnchor = styled.a`
  color: #00132b94;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 46px;
  height: 64px;
  margin: 0;
  padding: 0;
  font-size: 12px;
  line-height: 1.45;
  cursor: pointer;

  &:hover {
    color: #000c1ecc;
  }

  &:hover div {
    background-color: #dee1e5;
  }

  &:hover svg path {
    fill: #000c1ecc;
    transition: background-color 0.3s ease;
  }
`;

const SideBtn = styled.div`
  margin-bottom: 2px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SideIcon = styled.span`
  height: 20px;
  width: 20px;
  display: inline-block;
`;
