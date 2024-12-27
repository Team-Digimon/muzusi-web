import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import SignIn from "./pages/SignIn";
import Stocks from "./pages/Stocks";
import Home from "./pages/Home";
import Asset from "./pages/Asset";
import Transactions from "./pages/Transactions";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Layout이 적용되지 않는 경로 */}
        <Route path="/signin" element={<SignIn />} />

        {/* Layout이 적용되는 경로 */}
        <Route path="/" element={<Layout />}>
          {/* 기본 경로 */}
          <Route index element={<Home />} />
          <Route path="stocks" element={<Stocks />} />

          {/* 내 계좌 경로 */}
          <Route path="account">
            {/* 기본 경로 or asset */}
            <Route index element={<Asset />} />
            <Route path="asset" element={<Asset />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
