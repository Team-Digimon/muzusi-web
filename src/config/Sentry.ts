import * as Sentry from "@sentry/react";
import { sentryDsn } from "@/config/Env";

// 로컬 개발 환경에는 VITE_SENTRY_DSN을 비워두므로, 개발 중 발생하는
// 에러가 Sentry로 올라가 노이즈가 되지 않는다. DSN이 있는 빌드(prod)에서만 초기화된다.
export const initSentry = (): void => {
  if (!sentryDsn) return;

  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1
  });
};
