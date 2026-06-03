import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../backend/.env.e2e") });
dotenv.config({ path: path.resolve(__dirname, ".env.local"), override: true });
process.env.E2E_API_URL = "http://localhost:8081";
process.env.E2E_ADMIN_PHONE = process.env.E2E_ADMIN_PHONE ?? "09164911318";
process.env.E2E_CUSTOMER_PHONE = process.env.E2E_CUSTOMER_PHONE ?? "09120000001";

export default defineConfig({
	globalSetup: "./tests/e2e/globalSetup.ts",
	testDir: "./tests/e2e/specs",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "off",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
