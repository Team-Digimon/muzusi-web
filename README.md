# 무자본 주식 시뮬레이션, 무주시(MUZUSI)

웹 기반 모의 주식 투자 시뮬레이션 플랫폼 <br/>
학기 중 학습한 프론트엔드 기술을 실제 서비스 형태로 적용하고,<br/>
대용량 금융 데이터를 가독성 높게 시각화하는 것을 목표로 한 프로젝트입니다.

실제 서비스인 토스증권의 UI와 컴포넌트 구조를 분석하며<br/>
실무 수준의 화면 구성 방식을 학습했습니다.<br/>

**배포**: [muzusi.site](https://muzusi.site)

## Key Features
- 🔍 종목 검색 및 시세 조회
- 📊 캔들 차트 기반 가격 시각화
- 🔄 웹소켓 기반 실시간 주문 데이터 표시
- 💰 모의 매수 / 매도 기능

## 기술 스택

| 구분 | 스택 |
|---|---|
| Core | React 18, TypeScript, Vite |
| 상태 관리 | TanStack Query (서버 상태), React Context (인증) |
| 스타일 | styled-components |
| 차트 | lightweight-charts |
| 실시간 통신 | STOMP over SockJS |
| 테스트 | Vitest, Testing Library, MSW |
| CI/CD | GitHub Actions, Azure VM + Nginx |

## 폴더 구조

```
src/
├── api/         # 도메인별 API 함수 (account, auth, news, stocks)
├── components/  # 화면 단위 컴포넌트 (account, auth, common, home, layouts, stocks)
├── config/      # 환경 변수, URL 상수
├── contexts/    # 인증 컨텍스트
├── hooks/       # TanStack Query 커스텀 훅, 웹소켓 훅
├── mocks/       # MSW 핸들러 (테스트 전용)
├── pages/       # 라우트 단위 페이지
├── test/        # 테스트 셋업, 공용 렌더 헬퍼
├── types/       # 도메인 타입 정의
└── utils/       # 순수 유틸 함수
```

## 성능 개선

mock 데이터 기반 A/B 비교로 적용 전/후를 동일 조건에서 실측했습니다.

| 항목 | 적용 전 | 적용 후 | 개선 |
|---|---|---|---|
| 초기 번들 사이즈 (gzip) | 206.80 kB | 121.58 kB | **-41.2%** |
| 차트 리렌더 비용 (2,000개 데이터 기준) | 14.45ms | 9.3ms | **-35.6%** |
| 계좌 정보 중복 API 요청 | 2회 | 1회 | **-50%** |

- **라우트 단위 code splitting**: 페이지별 `React.lazy` + `Suspense` 적용, `lightweight-charts`(153kB)가 `/stocks/:code` 진입 시에만 로드되도록 분리
- **차트 리렌더 최적화**: `StockChart`가 데이터 변경마다 destroy 후 재생성하던 걸 `series.setData()` 기반 갱신으로 전환
- **서버 상태 관리 도입**: TanStack Query로 계좌 조회 로직을 공용 훅으로 통합, 거래 후 캐시 자동 갱신

## 테스트

Vitest + Testing Library + MSW 조합으로 유닛/훅/컴포넌트/페이지 통합 테스트를 작성했습니다. MSW는 백엔드 유무와 무관하게 결정적이고 빠른 테스트를 위해 표준적으로 채택한 방식입니다.

```bash
npm test              # 전체 테스트 실행
npm run test:watch    # watch 모드
npm run test:coverage # 커버리지 리포트 생성 (coverage/index.html)
```

핵심 로직(웹소켓 훅, 차트 컴포넌트, 페이지 통합 등) 8개 파일 기준 평균 커버리지 약 90%를 확보했습니다. 전체 커버리지는 아직 테스트를 작성하지 않은 컴포넌트가 남아있어 상대적으로 낮으며, 우선순위가 높은 영역부터 단계적으로 확대하는 방식으로 진행했습니다.

## CI/CD

- **CI**: PR마다 `lint` → `tsc --noEmit` → `test` → `build` 자동 실행, `develop` 브랜치는 이 체크를 통과해야 병합 가능
- **CD**: `develop` merge 시 Azure VM으로 자동 배포

## 트러블슈팅

- **`??` 연산자가 에러 처리를 무력화시킨 버그**: 공용 에러 핸들러가 서버 에러 페이로드를 `error.response.data ?? new Error(...)` 형태로 처리하고 있었는데, 서버가 빈 바디로 500을 내려주면 `error.response.data`가 빈 문자열(`''`)이 됩니다. `??`는 `null`/`undefined`일 때만 대체값을 쓰는 연산자라 `''`처럼 falsy하지만 nullish는 아닌 값은 그대로 통과시켜 `throw ''`가 됐고, 이 값을 받는 쪽의 `if (error) return <Error />` 체크가 빈 문자열은 falsy라는 이유로 무력화됐습니다. 계좌 조회/보유종목/거래내역 3곳이 이 헬퍼를 공유하고 있어 영향 범위가 넓었던 버그로, 런타임 타입가드로 페이로드 형태를 직접 검증하도록 수정했습니다.
- **CI에서만 재현되는 테스트 크래시**: 로컬에서는 통과하던 테스트가 CI에서만 `ERR_REQUIRE_ESM`으로 실패했습니다. 스택 트레이스를 vitest → jsdom → `html-encoding-sniffer` → `@exodus/bytes`까지 따라가보니, ESM 전용으로 배포된 `@exodus/bytes`를 Node의 `require()`가 동기적으로 불러오지 못해 발생한 문제였습니다. `html-encoding-sniffer`가 요구하는 Node 버전(20.19+/22.12+)과 CI에 고정돼 있던 Node 18의 불일치가 원인이었고, 기존 CI는 빌드만 수행해 이 코드 경로를 한 번도 실행한 적이 없어 지금까지 드러나지 않았던 것이었습니다. CI Node 버전을 22로 올려 해결했습니다.
- **배포 전환(AWS → Azure) 중 500 에러**: nginx 에러 로그를 근거로 Ubuntu 홈 디렉터리 권한 문제를 특정, 배포 경로를 nginx 표준 위치로 이전해 해결했습니다.

## 시작하기

```bash
npm install
npm run dev
```

## 기타
- 실제 주식 거래가 아닌 모의 투자 서비스입니다.
- 투자 판단의 책임은 사용자에게 있습니다.
