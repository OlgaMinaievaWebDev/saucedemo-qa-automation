# SauceDemo product sorting test cases

**Execution date** · November 27, 2026, America/Toronto

**Environment** · Hosted SauceDemo, Chromium, AI-assisted exploratory execution through the Playwright MCP CLI. Browser version was not recorded.

**Account** · Public demo user `standard_user`

**Scope** · Four sorting options on Products. Expected behavior follows the option labels and the observed product list. Business requirements were unavailable.

## Shared preparation and verification

Sign in with the demo credentials and open Products at `/inventory.html`. Record all displayed product names and their corresponding prices before sorting. For each case, compare the result against an independently ordered copy of that baseline.

Verify both the selected option and the actual displayed order. Confirm the same product set and name-price associations remain present, with no missing or duplicate cards. The observed baseline contained six distinct products; six is execution evidence, not an assumed permanent catalog size.

Cases ran in one session in this order: initial A–Z → Z–A → price ascending → price descending → A–Z. They can be rerun independently by choosing a different sort mode before selecting the target option.

## Automated execution — November 28, 2026

- **Method** · AI-assisted automated execution using Codex and the Playwright Test runner, separate from the exploratory session above.
- **Environment** · Hosted SauceDemo; Chromium 158.0.8127.18, Playwright 1.65.0, macOS (Darwin 27.0.0, arm64).
- **Commands** · `npx playwright test` and `npm run typecheck`.
- **Results** · All 24 suite tests passed, including SORT-001–004. TypeScript validation passed.

| Case | Automated starting mode | Actual result | Execution status |
| --- | --- | --- | --- |
| SORT-001 | Name (Z to A) | Displayed names matched an independently sorted ascending copy; selected value was `az`. | Passed |
| SORT-002 | Name (A to Z) | Displayed names matched an independently sorted descending copy; selected value was `za`. | Passed |
| SORT-003 | Price (high to low) | Displayed prices, converted to integer cents, matched ascending expected prices; selected value was `lohi`. | Passed |
| SORT-004 | Price (low to high) | Displayed prices, converted to integer cents, matched descending expected prices; selected value was `hilo`. | Passed |

The automated tests cover ordering and the selected option. They compare full name arrays for name sorting and full price arrays for price sorting. They do not yet verify product name-price associations or product identities during price sorting; those shared checks were performed in the exploratory session. Automated starting modes for SORT-001 and SORT-003 differ from the exploratory preconditions, but both exercise a transition from another mode.

## Observed test data

| Product | Price |
| --- | --- |
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

## SORT-001 — Sort product names A to Z

- **Priority** · Medium
- **Type** · Positive
- **Technique** · Equivalence partitioning, ascending name mode; state transition from another sort mode.
- **Preconditions** · Shared preparation complete. Select Price (high to low) before the target action.
- **Test data** · Current product baseline. Target option Name (A to Z), value `az`.
- **Steps** · Select Name (A to Z). Inspect the selected option and read every product name in displayed order. Perform the shared product-set and price-association checks.
- **Expected result** · Names match the baseline ordered alphabetically ascending. All products and their corresponding prices are preserved.
- **Actual result** · Backpack → Bike Light → Bolt T-Shirt → Fleece Jacket → Onesie → Test.allTheThings() T-Shirt (Red), using full names from the data table. The same six name-price pairs remained. The initial default was also Name (A to Z).
- **Execution status** · Passed in the exploratory session.

## SORT-002 — Sort product names Z to A

- **Priority** · Medium
- **Type** · Positive
- **Technique** · Equivalence partitioning, descending name mode; reversal state transition.
- **Preconditions** · Shared preparation complete. Name (A to Z) selected.
- **Test data** · Current product baseline. Target option Name (Z to A), value `za`.
- **Steps** · Select Name (Z to A). Inspect the selected option and read every name in displayed order. Perform the shared checks.
- **Expected result** · Names match the baseline ordered alphabetically descending. All products and their corresponding prices are preserved.
- **Actual result** · Test.allTheThings() T-Shirt (Red) → Onesie → Fleece Jacket → Bolt T-Shirt → Bike Light → Backpack, using full names from the data table. The same six name-price pairs remained.
- **Execution status** · Passed in the exploratory session.

## SORT-003 — Sort prices low to high

- **Priority** · Medium
- **Type** · Positive with equal-price edge coverage
- **Technique** · Equivalence partitioning, ascending price mode; numeric ordering with equal values.
- **Preconditions** · Shared preparation complete. Name (Z to A) selected.
- **Test data** · Current product baseline. Target option Price (low to high), value `lohi`.
- **Steps** · Select Price (low to high). Read each price and its product name. Compare prices numerically in integer cents and perform the shared checks.
- **Expected result** · Each price is less than or equal to the next. All name-price pairs are preserved. Equal-priced products may appear in either relative order.
- **Actual result** · $7.99 → $9.99 → $15.99 → $15.99 → $29.99 → $49.99. The same six products remained with unchanged associated prices.
- **Execution status** · Passed in the exploratory session.

## SORT-004 — Sort prices high to low

- **Priority** · Medium
- **Type** · Positive with equal-price edge coverage
- **Technique** · Equivalence partitioning, descending price mode; reversal state transition with equal values.
- **Preconditions** · Shared preparation complete. Price (low to high) selected.
- **Test data** · Current product baseline. Target option Price (high to low), value `hilo`.
- **Steps** · Select Price (high to low). Read each price and its product name. Compare prices numerically in integer cents and perform the shared checks.
- **Expected result** · Each price is greater than or equal to the next. All name-price pairs are preserved. Equal-priced products may appear in either relative order.
- **Actual result** · $49.99 → $29.99 → $15.99 → $15.99 → $9.99 → $7.99. The same six products remained with unchanged associated prices.
- **Execution status** · Passed in the exploratory session.

## Open questions and coverage limits

- No tie-breaking requirement was supplied for equal prices. The Bolt T-Shirt preceded the red T-Shirt in both observed price modes; that order is evidence, not a required assertion.
- Name comparison rules for case, accents, and locale are unspecified. The current catalog does not establish those behaviors.
- Sort persistence across refresh, navigation, logout, and new sessions was not explored.
- Cart preservation while changing sort modes was not explored. The cart was empty throughout.
- The dropdown offers four predefined choices. Invalid injected values are outside these normal UI cases.
- Exploratory results and automated execution results are recorded separately above; an automated pass covers only the assertions described in that execution record.
