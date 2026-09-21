import puppeteer from "puppeteer";
import { preview } from "vite";
import fs from "node:fs";

const server = await preview({ preview: { port: 4173 } });
const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });

const html = await page.content();
fs.writeFileSync("dist/index.html", html);

await browser.close();
await server.httpServer.close();
