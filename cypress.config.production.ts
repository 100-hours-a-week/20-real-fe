import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://cadev.kakaotech.com',
    setupNodeEvents(on, config) {
    },
    specPattern: ['**/*.cy.ts', '**/*.cy.tsx'],
    supportFile: false,
    env: {
      API_URL: "https://cadev.kakaotech.com/api",
    }
  },
});
