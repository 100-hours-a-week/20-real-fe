import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config({ path: '.env.development' });

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    setupNodeEvents(on, config) {
      return config
    },
    specPattern: ['**/*.cy.ts', '**/*.cy.tsx'],
    supportFile: false,
    env: {
      API_URL: process.env.CYPRESS_API_URL,
      TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
      TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD,
      API_KEY: process.env.CYPRESS_API_KEY,
    }
  },
});
