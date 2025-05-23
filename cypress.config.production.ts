import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://test.kakaotech.com',
    setupNodeEvents(on, config) {
    },
    specPattern: ['**/*.cy.ts', '**/*.cy.tsx'],
    supportFile: false,
    env: {
      API_URL: "http://test.kakaotech.com/api",
    }
  },
});
