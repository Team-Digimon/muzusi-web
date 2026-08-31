import { lazy, Suspense, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "@/components/layouts/Layout";
import AccountLayout from "@/components/layouts/AccountLayout";
import GlobalStyles from "@/GlobalStyles";
import useAuth from "@/contexts/useAuth";
import { setUpInterceptors } from "@/api/authApi";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Loading from "@/components/common/Loading";

// 실제 화면 콘텐츠(페이지)는 그 라우트에 진입할 때만 다운로드하도록
// lazy(dynamic import)로 전환한다. Layout/AccountLayout은 거의 모든
// 화면에서 즉시 필요한 뼈대라 그대로 정적 import로 남겨둔다.
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Stocks = lazy(() => import("@/pages/Stocks"));
const Home = lazy(() => import("@/pages/Home"));
const Asset = lazy(() => import("@/pages/Asset"));
const Records = lazy(() => import("@/pages/Records"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const AddressError = lazy(() => import("@/pages/AddressError"));
const KakaoRedirect = lazy(() => import("@/components/auth/KakaoRedirect"));
const NaverRedirect = lazy(() => import("@/components/auth/NaverRedirect"));

const App = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUpInterceptors(logout);
    setLoading(false);
  }, [logout]);

  if (loading) {
    return null;
  }

  return (
    <>
      <GlobalStyles />
      <ErrorBoundary>
        <Router>
          {/* Suspense는 아래 lazy() 페이지 중 아직 다운로드가 안 끝난
              컴포넌트를 렌더하려 할 때 fallback을 대신 보여준다.
              라우트 전환마다 새로 걸리는 게 아니라, 그 청크가 처음
              로드될 때 한 번만 잠깐 보인다(이후엔 브라우저/모듈 캐시). */}
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Layout이 적용되지 않는 경로 */}
              <Route path="/signin" element={<SignIn />} />
              <Route
                path="/login/oauth2/code/kakao"
                element={<KakaoRedirect />}
              />
              <Route
                path="/login/oauth2/code/naver"
                element={<NaverRedirect />}
              />
              <Route path="/signup" element={<SignUp />} />

              {/* Layout이 적용되는 경로 */}
              <Route path="/" element={<Layout />}>
                {/* 기본 경로 */}
                <Route index element={<Home />} />
                <Route path="stocks/:stockcode" element={<Stocks />} />
                <Route path="*" element={<AddressError />} />

                {/* 내 계좌 경로 */}
                <Route path="account" element={<AccountLayout />}>
                  <Route path="asset" element={<Asset />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="records" element={<Records />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </>
  );
};

export default App;
