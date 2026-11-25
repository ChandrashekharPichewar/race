# Race Ridesharing — Enterprise Playwright Automation Suite

Enterprise-grade Playwright + TypeScript test automation framework built with **Page Object Model (POM)**, **Typed API Clients**, **Custom Fixtures**, **Data-Driven JSON Variations**, **Environment Config**, **Global Setup/Teardown**, and **Tag-Based CI Execution**.

## Architecture

```text
playwright-test/
├── api/                    # Typed API clients (AuthApiClient, SupportApiClient)
├── config/                 # Environment configuration (local, staging, prod)
├── fixtures/               # Custom Playwright fixtures (POMs, APIs, authenticatedPage, logger)
├── pages/                  # Page Object Models (BasePage, HomePage, AuthModalPage, ReportIssuePage, SupportTicketsPage)
├── setup/                  # Global setup & teardown hooks
├── test-data/              # JSON test variation datasets (auth, ride search, support issues)
├── tests/                  # Tagged test specs (@smoke, @regression, @auth, @private, @api)
├── utils/                  # Logger & route/session seeding helpers
└── playwright.config.ts    # Multi-reporter (HTML, JSON, list) & Vite webServer config
```

## Quick Commands

```powershell
cd playwright-test

# Typecheck & list all tests
npm run typecheck
npm run test:list

# Run by tag
npm run test:smoke
npm run test:auth
npm run test:private
npm run test:api
npm run test:regression

# Run against staging/prod
$env:TEST_ENV="staging"; npm run test:smoke

# Include live Render backend API tests
$env:RUN_LIVE_API="true"; npm run test:api
```
