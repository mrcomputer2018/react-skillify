import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        specPattern: "src/test/e2e/**/*.cy.ts",
        supportFile: "src/test/e2e/support/e2e.ts",
        fixturesFolder: "src/test/e2e/fixtures",
        video: false,
    },
});
