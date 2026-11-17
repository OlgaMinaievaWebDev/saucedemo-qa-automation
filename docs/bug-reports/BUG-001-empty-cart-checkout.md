# BUG-001 — Checkout reaches order confirmation with an empty cart

| Field | Detail |
| --- | --- |
| Application | [SauceDemo](https://www.saucedemo.com/) |
| Status | Potential defect · awaiting requirement confirmation |
| Found during | Manual testing of [CART-004](../cart-test-cases.md#cart-004--remove-the-last-cart-item), related to [CART-008](../cart-test-cases.md#cart-008--attempt-to-start-checkout-with-an-empty-cart) |
| Environment | Hosted demo. Browser and version were not recorded. |

## Steps to reproduce

1. Sign in as `standard_user` using the demo password shown on the login page.
2. Add one product, open the cart, and remove that product. Confirm the cart has zero items.
3. Click **Checkout**.
4. Enter valid sample values in the checkout form and click **Continue**.
5. Click **Finish** on the checkout overview.

## Actual result

The tester reported reaching the order confirmation screen with zero items in the cart.

## Proposed expected result

An order should contain at least one item before checkout can complete. If this rule is confirmed, an empty cart should never reach order confirmation. The point at which checkout should stop and the message it should display are open decisions.

## Impact

The confirmation screen can give a shopper the impression that an order was placed even though the cart contained no products. This finding concerns the confirmation shown by the demo.

## Requirement and evidence

- No public SauceDemo requirement about zero-item orders was found in the [official sample app repository](https://github.com/saucelabs/sample-app-web).
- The result is based on the tester’s manual observation. During a rerun, capture the browser and version, the empty cart, and the confirmation screen.
