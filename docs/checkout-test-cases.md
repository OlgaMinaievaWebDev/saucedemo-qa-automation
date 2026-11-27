# SauceDemo checkout test cases

This plan contains seven cases. CHECKOUT-001–007 have passing automated coverage in Chromium. Product requirements were unavailable, so observed behavior is the regression baseline.

**Latest verified run** · November 26, 2026. All 18 project tests passed in Chromium, including five checkout cases. Browser version was not recorded. Automated runs use the shared [customer data](../test-data/customer.ts); the manual sample values below may differ. Execution status refers to the automated scenario, not a separate rerun with every literal manual value.

Use a fresh signed-in session and arrange cart contents independently for each case. Do not treat the proposed results as confirmed requirements. All customer details are fictional.

## CHECKOUT-001 — Complete checkout with one product

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Positive, end-to-end |
| Test design technique | State transition testing |
| Preconditions | Signed in as `standard_user`. Cart contains exactly one Sauce Labs Backpack with quantity `1`. **Your Cart** is open. |
| Test data | First name `Test`, last name `Shopper`, postal code `12345`. Customer details are fictional. |

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Note the Backpack's price, then click **Checkout**. | **Checkout: Your Information** opens at `/checkout-step-one.html`. |
| 2 | Enter the customer test data and click **Continue**. | **Checkout: Overview** opens at `/checkout-step-two.html`. |
| 3 | Inspect the product and order summary. | Exactly one Backpack appears with quantity `1`. Its price matches the cart price. Payment and shipping information are displayed. |
| 4 | Check the amounts. | Item total equals the Backpack price. Tax and total are displayed, and total equals item total plus tax. |
| 5 | Confirm Overview is still open and the confirmation message is absent. Click **Finish**, then inspect the resulting page. | `/checkout-complete.html` opens and **Thank you for your order!** is visible. The cart badge disappears. |
| 6 | Click **Back Home**, then open the cart. | Products opens first. Reopening the cart shows zero product rows. |

**Execution status** · Passed · automated Playwright execution in Chromium, November 26, 2026.

**Actual result** · Completed checkout after Finish, verified confirmation and the cleared badge, then returned to Products and reopened a cart with zero rows. Product identity, quantity, prices, and currency arithmetic passed.

**Exploratory evidence** · On November 21, 2026, AI-assisted exploration using Codex and the Playwright MCP CLI reached confirmation through steps 1–5. The Overview displayed item total `$29.99`, tax `$2.40`, and total `$32.39`. The confirmation screen showed an empty header cart indicator. The later automated run verified step 6; the original exploration stopped at confirmation.

**Open requirement** · The tax-rate rule is unconfirmed. This case checks arithmetic without assuming a specific rate. The amounts recorded above are exploratory evidence.

**Automation note** · Preserve the ordered transition from Overview to confirmation. Assert the pre-Finish state, click Finish, then assert the confirmation URL, message, and cleared cart indicator. This checks the normal journey without claiming direct URL access is blocked.

## CHECKOUT-002 — Submit an entirely empty customer-information form

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Negative |
| Test design technique | Empty-form validation; blank-input partition |
| Preconditions | Signed in with one Backpack in the cart. Open Checkout: Your Information. |
| Test data | First name, last name, and postal code blank. |

| Step | Action | Expected result based on observed behavior |
| --- | --- | --- |
| 1 | Leave all three fields blank and click **Continue**. | Stay on the information page and show `Error: First Name is required`. |
| 2 | Inspect the cart indicator. | The item remains in the cart. No order confirmation is shown. |

**Execution status** · Passed · automated Playwright execution in Chromium, November 26, 2026.

**Actual result** · Displayed `Error: First Name is required` after all fields were submitted blank. The URL stayed on /checkout-step-one.html and the cart badge stayed at 1.

## CHECKOUT-003 — Submit without a first name, then correct it

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Negative and recovery |
| Test design technique | Equivalence partitioning, blank versus populated first name; recovery transition |
| Preconditions | Signed in with one Backpack in the cart. Open Checkout: Your Information. |
| Test data | First name blank, last name `Shopper`, postal code `12345`. Correction is `Test`. |

| Step | Action | Expected result based on observed behavior |
| --- | --- | --- |
| 1 | Enter the last name and postal code, leave first name blank, and click **Continue**. | Stay on the information page and show `Error: First Name is required`. Last Name and Postal Code retain their entered values; the cart badge stays at 1. |
| 2 | Fill only First Name with Test, leaving Last Name and Postal Code unchanged, and click **Continue**. | Open Overview with exactly one Backpack row and quantity 1. Stop before Finish. |

**Execution status** · Passed · automated Playwright execution in Chromium, November 26, 2026.

**Actual result** · Displayed `Error: First Name is required`. Last Name and Postal Code retained their values. Filling only First Name allowed navigation to Overview, which contained exactly one Backpack with quantity 1.

## CHECKOUT-004 — Submit without a last name

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Negative |
| Test design technique | Equivalence partitioning, blank versus populated last name |
| Preconditions | Signed in with one Backpack in the cart. Open Checkout: Your Information. |
| Test data | First name `Test`, last name blank, postal code `12345`. |

| Step | Action | Expected result based on observed behavior |
| --- | --- | --- |
| 1 | Enter the first name and postal code, leave last name blank, and click **Continue**. | Stay on the information page and show `Error: Last Name is required`. |
| 2 | Inspect the cart indicator. | The item remains in the cart. No order confirmation is shown. |

**Execution status** · Passed · automated Playwright execution in Chromium, November 26, 2026.

**Actual result** · Displayed `Error: Last Name is required` with First Name and Postal Code populated. The URL stayed on /checkout-step-one.html and the badge stayed at 1.

## CHECKOUT-005 — Submit without a postal code

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Negative |
| Test design technique | Equivalence partitioning, blank versus populated postal code |
| Preconditions | Signed in with one Backpack in the cart. Open Checkout: Your Information. |
| Test data | First name `Test`, last name `Shopper`, postal code blank. |

| Step | Action | Expected result based on observed behavior |
| --- | --- | --- |
| 1 | Enter both names, leave postal code blank, and click **Continue**. | Stay on the information page and show `Error: Postal Code is required`. |
| 2 | Inspect the cart indicator. | The item remains in the cart. No order confirmation is shown. |

**Execution status** · Passed · automated Playwright execution in Chromium, November 26, 2026.

**Actual result** · Displayed `Error: Postal Code is required` with both names populated. The URL stayed on /checkout-step-one.html and the badge stayed at 1.

**Validation coverage scope** · CHECKOUT-002 covers the all-empty combination. CHECKOUT-003–005 isolate one blank field while the others are populated. These cases cover blank-input partitions only. Whitespace-only values, maximum lengths, and postal formats require confirmed rules before defining their expected results.

## CHECKOUT-006 — Review two products and verify order arithmetic

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Positive |
| Test design technique | Equivalence partitioning, multiple distinct products; arithmetic consistency |
| Preconditions | Signed in. Add Backpack and Bike Light, each with quantity 1. Record their displayed cart prices and open Checkout: Your Information. |
| Test data | First name `Test`, last name `Shopper`, postal code `12345`. |

| Step | Action | Proposed expected result |
| --- | --- | --- |
| 1 | Fill the information form and click **Continue**. | Overview contains exactly the Backpack and Bike Light, each with quantity 1. |
| 2 | Compare each Overview price with its recorded cart price. | Each product price matches its cart price. |
| 3 | Add the two product prices and compare with Item total. Add displayed tax to Item total and compare with Total. | Item total equals the sum of product prices. Total equals Item total plus displayed tax, calculated to the displayed currency precision. No specific tax rate is assumed. Stop before Finish. |

**Execution status** · Passed · automated Playwright execution in Chromium, November 27, 2026, including comparison with prices captured from the cart.

**Actual result** · Overview contained exactly the Backpack and Bike Light with quantity 1 each. Both product names were correct and each Overview price matched its recorded cart price. Subtotal equaled the sum of both prices, and total equaled subtotal plus displayed tax using integer cents. Execution stopped before Finish.

**Automation note** · Parse the displayed currency amounts into integer cents before summing and comparing. Compare subtotal and total numerically in cents, rather than relying on exact equality of binary floating-point dollar calculations. Use the displayed tax amount without inventing a tax-rate rule.


**Coverage note** · The automated test records each product’s price from its cart row before checkout, matching manual step 2.

## CHECKOUT-007 — Cancel checkout from the information page

| Field | Detail |
| --- | --- |
| Priority | Medium |
| Type | Alternative flow |
| Test design technique | State transition, cart → information → cart |
| Preconditions | Signed in with exactly one Backpack in the cart. Open Checkout: Your Information. |
| Test data | One Backpack with quantity 1. Customer fields may remain blank. |

| Step | Action | Expected result based on observed behavior |
| --- | --- | --- |
| 1 | Click **Cancel**. | Return to Your Cart at /cart.html without showing order confirmation. |
| 2 | Inspect all cart rows, the Backpack quantity, and the badge. | Exactly one Backpack remains with quantity 1 and badge 1. |

**Execution status** · Passed · automated Playwright execution in Chromium, November 27, 2026.

**Actual result** · Cancel returned to /cart.html. Exactly one Backpack remained with quantity 1 and badge 1. The order-confirmation heading was absent.

## Open requirements and automation order

- Blank first name, last name, and postal code validation messages have been observed and automated. Whitespace-only handling, length limits, and business approval of these rules remain open. The all-empty case demonstrates first-name validation first, without establishing all error-precedence combinations.
- Confirm postal-code rules and tax calculation rules before adding format, length, or rate-specific assertions.
- Cancellation to the cart and preservation of its item have been observed and automated; product requirements remain unavailable.
- Empty-cart checkout is documented separately in [CART-008](cart-test-cases.md) and [BUG-001](bug-reports/BUG-001-empty-cart-checkout.md). Its expected business behavior remains unresolved.
- All seven cases now have automated coverage, including CHECKOUT-006’s cart-price comparison. CHECKOUT-002, CHECKOUT-004, and CHECKOUT-005 use parameterized tests; CHECKOUT-003 stays separate for retention and recovery.
