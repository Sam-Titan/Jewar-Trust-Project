import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: "*.spec.ts",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:4173/Jewar-Trust-Project/",
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
  },
  webServer: {
    command: "pnpm exec vite preview --port 4173",
    url: "http://localhost:4173/Jewar-Trust-Project/",
    reuseExistingServer: true,
  },
});
