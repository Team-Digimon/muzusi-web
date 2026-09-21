import puppeteer from "puppeteer";
import { preview } from "vite";
import fs from "node:fs";

const server = await preview({ preview: { port: 4173 } });
// GitHub Actions(ubuntu-latest) 컨테이너는 unprivileged user namespace가
// 막혀있어 Chromium의 기본 샌드박스를 못 씀 - 실제 CI에서
// "No usable sandbox!"로 크래시하는 걸 확인하고 추가함.
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();

await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });

const html = await page.content();
fs.writeFileSync("dist/index.html", html);

await browser.close();
await server.httpServer.close();
