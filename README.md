# SauceDemo QA Automation

A QA portfolio project using **Playwright and TypeScript** to test [SauceDemo](https://www.saucedemo.com/), a public demo store. It combines exploratory testing, written test cases, and automated checks for login, the shopping cart, checkout, and product sorting.

**Latest local verification — November 28, 2026:** All **24 automated cases passed in Chromium**. TypeScript validation passed.

## What is tested

| Area | Cases | Coverage |
| --- | --- | --- |
| Login | LOGIN-001–007 | Valid sign-in, incorrect password, locked-out user, empty fields, and dismissing an error. |
| Cart | CART-001–005 | Adding one or two products, checking names, quantities and prices, removing products, and keeping cart contents while continuing shopping. |
| Cart controls | CART-006 | Quantity display, absence of standard input fields, and add/remove controls across Products, Cart, and product details. |
| Checkout | CHECKOUT-001–007 | Successful purchase, required-field validation, retained form values and recovery, two-product price and total checks, and cancellation. |
| Sorting | SORT-001–004 | Product names A–Z and Z–A, and prices low–high and high–low, including equal prices. |

The suite contains **7 login, 6 cart, 7 checkout, and 4 sorting cases**. Three checkout validation cases share a parameterized implementation and appear as separate tests in reports. The manual cart plan also includes cases that have not yet been automated.

## How the framework is organized

- **Tests** keep each scenario's steps and expected results readable.
- **Page objects** handle reusable actions on Products, Cart, and the three checkout stages.
- **Header component** handles opening the cart and exposes the cart badge for assertions.
- **Custom fixtures** provide fresh page objects and the Header component for each test.
- **Test data** stores demo users, product names, and fictional customer details in one place.
- **Currency helper** parses displayed amounts into integer cents for price calculations.
- **Login helper** shares the sign-in steps.

Each test starts in a fresh browser context. Cart and checkout tests sign in before arranging their own cart contents, so they can run independently.

## Test design and findings

I used AI-assisted browser exploration with Codex and Playwright to investigate the application and document observed behavior. Cart cases cover state changes such as empty → one item → multiple items and back to empty, along with representative single-product and multi-product scenarios.

- [Login test cases](docs/login-test-cases.md)
- [Cart test cases and open requirements](docs/cart-test-cases.md)
- [Checkout test cases and execution records](docs/checkout-test-cases.md)
- [Sorting test cases and execution records](docs/sorting-test-cases.md)
- [Potential defect — empty-cart checkout](docs/bug-reports/BUG-001-empty-cart-checkout.md)

The empty-cart checkout report separates the tester's observation from a proposed requirement. The expected business rule still needs confirmation.

## Run locally

Install Node.js and npm, then run these commands from the project folder:

```bash
npm ci
npx playwright install chromium
npx playwright test
```

The current configuration runs **Chromium only**, both locally and in GitHub Actions. The current complete suite has been verified in Chromium.

| Task | Command |
| --- | --- |
| Run all tests | `npx playwright test` |
| Run login tests | `npx playwright test tests/login.spec.ts` |
| Run cart tests | `npx playwright test tests/cart.spec.ts` |
| Run checkout tests | `npx playwright test tests/checkout.spec.ts` |
| Run sorting tests | `npx playwright test tests/sorting.spec.ts` |
| Watch the browser | `npx playwright test --headed` |
| Check TypeScript | `npm run typecheck` |
| Open the HTML report | `npx playwright show-report` |

## GitHub Actions

The [workflow](.github/workflows/playwright.yml) runs on pushes and pull requests targeting `main` or `master`. It installs dependencies and browsers, checks TypeScript, runs the tests, and uploads the HTML report. CI retries failed tests up to twice, with a trace recorded on the first retry.

## Project files

| Location | Purpose |
| --- | --- |
| `tests/` | Login, cart, checkout, and sorting scenarios |
| `pages/` | Products, cart, customer-information, Overview, and confirmation page objects |
| `components/` | Shared HeaderComponent |
| `fixtures/` | Test-scoped page-object and component fixtures |
| `helpers/` | Login and currency-parsing helpers |
| `test-data/` | Demo users, products, and fictional customer details |
| `docs/` | Manual test cases and bug reports |
| `playwright.config.ts` | Browser, base URL, reporting, and retry settings |
