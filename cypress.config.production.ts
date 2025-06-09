import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'https://cadev.kakaotech.com',
    setupNodeEvents(on, config) {
    },
    specPattern: ['**/*.cy.ts', '**/*.cy.tsx'],
    supportFile: false,
    env: {
      API_URL: "https://cadev.kakaotech.com/api",
      TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
      TEST_PASSWORD: process.env.CYPRESS_PASSWORD,
      TEST_API_KEY: process.env.CYPRESS_API_KEY,
    }
  },
});
