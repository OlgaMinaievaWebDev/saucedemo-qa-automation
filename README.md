# SauceDemo Login Test Automation

This QA portfolio project uses **Playwright and TypeScript** to test the login page of [SauceDemo](https://www.saucedemo.com/), a public demo store. It covers successful sign-in, rejected credentials, required fields, and error dismissal.

**Verified result:** All six cases passed in Chromium, Firefox, and WebKit, for **18 passing test runs**.

## What the tests cover

| Case | Scenario | Expected behavior |
| --- | --- | --- |
| LOGIN-001 | Valid credentials | Opens the Products page. |
| LOGIN-002 | Incorrect password | Shows a credential error and stays on the login page. |
| LOGIN-003 | Locked-out user | Shows a lockout error even with the correct password. |
| LOGIN-004 | Both fields empty | Shows that the username is required. |
| LOGIN-005 | Password empty | Shows that the password is required. |
| LOGIN-006 | Dismiss an error | Hides the error and its dismiss button while keeping the login form visible. |

I explored the login page with Codex and Playwright browser controls, recorded the observed results, and then automated each case. The tests start on the login page and share a small helper for entering credentials and submitting the form. Each test keeps its own assertions so its expected behavior is easy to see.

- [Test cases and exploratory results](docs/login-test-cases.md)
- [Automated login tests](tests/login.spec.ts)
- [GitHub Actions workflow](.github/workflows/playwright.yml) for running the suite on pushes and pull requests targeting the main branches

## Run the tests

With Node.js and npm installed, run these commands from the project folder:

```bash
npm ci
npx playwright install
npx playwright test
```

Playwright runs all six cases in the three configured browsers. To run only Chromium, use `npx playwright test --project=chromium`. Open the HTML report with `npx playwright show-report`, or check TypeScript with `npm run typecheck`.
