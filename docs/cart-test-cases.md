# SauceDemo shopping cart test cases

**Environment:** [SauceDemo](https://www.saucedemo.com/), Chromium, Playwright MCP CLI, November 12, 2026.  
**Account:** Sign in with the public demo credentials `standard_user` / `secret_sauce`.  
**Setup:** Start each case in a fresh browser session or remove all cart items before arranging its preconditions. Prepare items through the UI.  
**Basis:** Expected results labeled **Observed** describe the behavior seen in this session. They are candidate regression checks. Product requirements were unavailable. Priorities are QA recommendations.

## Test design

- **State transitions:** Cover empty → one item → multiple items and the reverse. Verify the cart count and product rows after each relevant transition.
- **Equivalence partitioning:** Use one representative product for a single-item cart and two different products for a multi-item cart. Separately examine a product already in the cart and the empty cart. These samples do not establish a maximum cart size.
- **Negative coverage:** Check whether the normal UI offers a duplicate-add or quantity-edit action. Probe the checkout entry point with an empty cart and record what happens pending a requirement.

## Manual cases

### CART-001 — Add one product and open the cart

- **Type / priority:** Positive / High
- **Technique:** State transition, empty → one item
- **Preconditions:** Signed in on **Products** with an empty cart.
- **Test data:** Sauce Labs Backpack.
- **Steps:** 1. Click **Add to cart** for the Backpack. 2. Check the product button and cart count. 3. Open the cart from the header.
- **Expected result (Observed):** The Backpack button changes to **Remove** and the cart count becomes `1`. The header opens **Your Cart** at `/cart.html`, with one Backpack row and QTY `1`. The cart price matches the price displayed on **Products**.

### CART-002 — Add two different products

- **Type / priority:** Positive / High
- **Technique:** Equivalence partitioning, multiple distinct products
- **Preconditions:** Signed in on **Products** with an empty cart.
- **Test data:** Sauce Labs Backpack and Sauce Labs Bike Light.
- **Steps:** 1. Add the Backpack. 2. Add the Bike Light. 3. Open the cart and inspect the rows.
- **Expected result (Observed):** The cart count goes from `1` to `2`. Both products appear in separate rows with QTY `1` each.

### CART-003 — Remove one product from a cart with two items

- **Type / priority:** Positive / High
- **Technique:** State transition, multiple items → one item
- **Preconditions:** **Your Cart** is open and contains the Backpack and Bike Light.
- **Test data:** Remove the Backpack. Keep the Bike Light.
- **Steps:** 1. Click **Remove** on the Backpack row. 2. Inspect the count and remaining rows.
- **Expected result (Observed):** The Backpack disappears. The Bike Light remains with QTY `1`, and the cart count drops to `1`.

### CART-004 — Remove the last cart item

- **Type / priority:** Edge / High
- **Technique:** State transition at the empty-cart boundary, one item → zero items
- **Preconditions:** **Your Cart** is open and contains only the Bike Light.
- **Test data:** Sauce Labs Bike Light.
- **Steps:** 1. Click **Remove** on the Bike Light row. 2. Inspect the cart and header.
- **Expected result (Observed):** **Your Cart** stays open with no product rows. The numeric badge disappears and the cart control indicates that the cart is empty.

### CART-005 — Return to Products and reopen a populated cart

- **Type / priority:** Positive / Medium
- **Technique:** State transition across pages, cart → products → cart
- **Preconditions:** **Your Cart** is open and contains only the Backpack.
- **Test data:** Sauce Labs Backpack.
- **Steps:** 1. Click **Continue Shopping**. 2. Inspect the header count and Backpack button. 3. Open the cart again.
- **Expected result (Observed):** **Continue Shopping** opens **Products** at `/inventory.html`. The cart count stays at `1`, and the Backpack button shows **Remove**. Reopening the cart shows the same Backpack with QTY `1`.

### CART-006 — Inspect quantity and duplicate-add controls

- **Type / priority:** Negative / Medium
- **Technique:** Equivalence partitioning, product already present versus product absent
- **Preconditions:** Signed in on **Products** with an empty cart.
- **Test data:** Sauce Labs Backpack.
- **Steps:** 1. Add the Backpack. 2. Look for a second add action on its product card. 3. Open the cart and look for a quantity input or increment and decrement controls. 4. Open Backpack details from the cart and inspect the available cart action.
- **Expected result (Observed):** The product card and detail page offer **Remove** for the Backpack. The cart shows one Backpack row with QTY `1` as text. No duplicate-add action or quantity editor is available on the inspected screens.

### CART-007 — Remove a cart item from Products

- **Type / priority:** Positive / Medium
- **Technique:** State transition across pages, present → absent
- **Preconditions:** On **Products** with only the Backpack in the cart.
- **Test data:** Sauce Labs Backpack.
- **Steps:** 1. Click **Remove** on the Backpack card. 2. Check the card and header. 3. Open the cart.
- **Expected result (Observed):** **Add to cart** returns on the Backpack card, the header indicates an empty cart, and **Your Cart** shows no product rows.

### CART-008 — Attempt to start checkout with an empty cart

- **Type / priority:** Negative / High for requirements review
- **Technique:** Equivalence partitioning, empty versus populated cart at checkout entry
- **Preconditions:** Signed in on **Products** with an empty cart.
- **Test data:** Zero products.
- **Steps:** 1. Open the empty cart from the header. 2. Confirm there are no product rows. 3. Click **Checkout** if available and record the result. Stop at the next screen.
- **Expected result (Pending requirement):** Confirm whether an empty cart should block checkout entry or allow navigation. No pass or fail verdict until this is confirmed.
- **Observed:** **Checkout** was visible and opened **Checkout: Your Information** at `/checkout-step-one.html`. No checkout information was submitted.

## Open requirements

- Should checkout entry be blocked for an empty cart? If so, should the button be disabled, hidden, or show an error?
- Is a quantity of one per product intentional? If higher quantities are supported in another flow, what are the controls, limits, and expected badge behavior?
- Should the cart survive a page reload, logout and login, or a new browser session? Navigation within the signed-in session was checked. Longer persistence was outside this exploration.

## Automation order

1. **CART-001:** Verify the primary add-to-cart flow by checking the product row, its QTY, and the header count.
2. **CART-003 and CART-004:** Verify that removal targets the correct row, updates the count, and handles removal of the last item.
3. **CART-002 and CART-005:** Verify that distinct products remain separate and that navigating back to Products preserves the cart.
4. Add **CART-006** and **CART-007** for the quantity display and the removal path from Products. Keep **CART-008** exploratory until the checkout rule is confirmed.
