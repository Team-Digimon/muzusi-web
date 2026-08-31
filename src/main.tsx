import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import AuthProvider from "@/contexts/AuthProvider";
import queryClient from "@/api/queryClient";

// index.html에 정적으로 존재하는 엘리먼트라 실제로 null일 일은 없지만,
// getElementById의 반환 타입은 HTMLElement | null이라 단언이 필요하다.
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
);
