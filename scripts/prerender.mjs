import puppeteer from "puppeteer";
import { preview } from "vite";
import fs from "node:fs";

const server = await preview({ preview: { port: 4173 } });
// GitHub Actions(ubuntu-latest) 컨테이너는 unprivileged user namespace가
// 막혀있어 Chromium의 기본 샌드박스를 못 씀 - 실제 CI에서
// "No usable sandbox!"로 크래시하는 걸 확인하고 추가함.
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();

// styled-components v6는 프로덕션에서 기본적으로 "speedy mode"를 써서
// CSS 규칙을 <style> 태그의 텍스트가 아니라 CSSOM(insertRule)에 직접
// 주입한다. 화면엔 정상 렌더링되지만 page.content()(outerHTML 직렬화)로는
// 그 규칙이 안 잡혀서 <style data-styled>가 빈 채로 저장돼버렸다 - 실제
// 배포 후 새로고침 시 스타일 없는 HTML이 잠깐 보이는 원인이었다.
// 이 페이지(프리렌더 캡처용 한정)에서만 speedy를 꺼서 텍스트로 쓰게 한다.
await page.evaluateOnNewDocument(() => {
  window.SC_DISABLE_SPEEDY = true;
});

await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });

const html = await page.content();
fs.writeFileSync("dist/index.html", html);

await browser.close();
await server.httpServer.close();
