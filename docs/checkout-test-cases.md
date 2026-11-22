# SauceDemo checkout test cases

This plan contains seven manual cases. CHECKOUT-001 follows the explored demo flow. CHECKOUT-002–007 are proposed checks awaiting browser verification and requirement confirmation. Product requirements were unavailable.

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

**Execution status** ·  Passed.

**Exploratory evidence** · On November 21, 2026, AI-assisted exploration using Codex and the Playwright MCP CLI reached confirmation through steps 1–5. The Overview displayed item total `$29.99`, tax `$2.40`, and total `$32.39`. The confirmation screen showed an empty header cart indicator. Step 6 remains unverified.

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

| Step | Action | Proposed expected result |
| --- | --- | --- |
| 1 | Leave all three fields blank and click **Continue**. | Stay on the information page and show a required-field error. Record the exact message and field identified. |
| 2 | Inspect the cart indicator. | The item remains in the cart. No order confirmation is shown. |

**Execution status** · Not executed. Expected behavior and exact validation messages require confirmation.

## CHECKOUT-003 — Submit without a first name, then correct it

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Negative and recovery |
| Test design technique | Equivalence partitioning, blank versus populated first name; recovery transition |
| Preconditions | Signed in with one Backpack in the cart. Open Checkout: Your Information. |
| Test data | First name blank, last name `Shopper`, postal code `12345`. Correction is `Test`. |

| Step | Action | Proposed expected result |
| --- | --- | --- |
| 1 | Enter the last name and postal code, leave first name blank, and click **Continue**. | Stay on the information page and show validation identifying the missing first name. Record the exact message. |
| 2 | Fill first name with Test. Refill the other values if necessary and click **Continue**. | Open Overview with the Backpack still present. Stop before Finish. |

**Execution status** · Not executed. Expected behavior and exact validation messages require confirmation.

## CHECKOUT-004 — Submit without a last name

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Negative |
| Test design technique | Equivalence partitioning, blank versus populated last name |
| Preconditions | Signed in with one Backpack in the cart. Open Checkout: Your Information. |
| Test data | First name `Test`, last name blank, postal code `12345`. |

| Step | Action | Proposed expected result |
| --- | --- | --- |
| 1 | Enter the first name and postal code, leave last name blank, and click **Continue**. | Stay on the information page and show validation identifying the missing last name. Record the exact message. |
| 2 | Inspect the cart indicator. | The item remains in the cart. No order confirmation is shown. |

**Execution status** · Not executed. Expected behavior and exact validation messages require confirmation.

## CHECKOUT-005 — Submit without a postal code

| Field | Detail |
| --- | --- |
| Priority | High |
| Type | Negative |
| Test design technique | Equivalence partitioning, blank versus populated postal code |
| Preconditions | Signed in with one Backpack in the cart. Open Checkout: Your Information. |
| Test data | First name `Test`, last name `Shopper`, postal code blank. |

| Step | Action | Proposed expected result |
| --- | --- | --- |
| 1 | Enter both names, leave postal code blank, and click **Continue**. | Stay on the information page and show validation identifying the missing postal code. Record the exact message. |
| 2 | Inspect the cart indicator. | The item remains in the cart. No order confirmation is shown. |

**Execution status** · Not executed. Expected behavior and exact validation messages require confirmation.

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

**Execution status** · Not executed. Expected behavior and exact validation messages require confirmation.

**Automation note** · Parse the displayed currency amounts into integer cents before summing and comparing. Compare subtotal and total numerically in cents, rather than relying on exact equality of binary floating-point dollar calculations. Use the displayed tax amount without inventing a tax-rate rule.

## CHECKOUT-007 — Cancel checkout from the information page

| Field | Detail |
| --- | --- |
| Priority | Medium |
| Type | Alternative flow |
| Test design technique | State transition, cart → information → cart |
| Preconditions | Signed in with exactly one Backpack in the cart. Open Checkout: Your Information. |
| Test data | One Backpack with quantity 1. Customer fields may remain blank. |

| Step | Action | Proposed expected result |
| --- | --- | --- |
| 1 | Click **Cancel**. | Return to Your Cart at /cart.html without showing order confirmation. |
| 2 | Inspect all cart rows, the Backpack quantity, and the badge. | Exactly one Backpack remains with quantity 1 and badge 1. |

**Execution status** · Not executed. Expected behavior and exact validation messages require confirmation.

## Open requirements and automation order

- Confirm which customer fields are mandatory, their validation messages, error precedence, and whether whitespace-only input is rejected. These cases isolate blank fields and do not define length or format limits.
- Confirm postal-code rules and tax calculation rules before adding format, length, or rate-specific assertions.
- Confirm the cancellation destination and cart-preservation rule.
- Empty-cart checkout is documented separately in [CART-008](cart-test-cases.md) and [BUG-001](bug-reports/BUG-001-empty-cart-checkout.md). Its expected business behavior remains unresolved.
- Verify the proposed cases manually first. Automate CHECKOUT-001 first, then CHECKOUT-002–005, followed by CHECKOUT-006 and CHECKOUT-007.
