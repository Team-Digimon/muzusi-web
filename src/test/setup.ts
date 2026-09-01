// Vitest가 각 테스트 파일을 실행하기 전에 한 번씩 불러오는 전역 셋업.
// jest-dom의 커스텀 matcher(toBeInTheDocument 등)를 expect에 등록한다.
import "@testing-library/jest-dom/vitest";
