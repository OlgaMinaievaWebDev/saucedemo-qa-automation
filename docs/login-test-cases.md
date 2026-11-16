# SauceDemo login test cases

**Application** · [SauceDemo](https://www.saucedemo.com/)  
**Execution date** · November 8, 2026  
**Environment** · Codex in-app browser (browser version unverified), macOS 27.0.1 (host OS).  
**Execution method** · AI-assisted exploratory execution with Codex, using Playwright browser controls through the computer-use MCP. All six outcomes were observed in one session. The preconditions below are for independent reruns.  
**Common precondition** · Start each case signed out on the login page with both fields empty and no error visible, unless the case specifies otherwise.

### LOGIN-001 · Sign in with valid credentials

- **Priority** · High
- **Preconditions** · Common precondition.
- **Test data** · Username `standard_user`, password `secret_sauce`.
- **Steps** · Enter the username and password, then click **Login**.
- **Expected result** · The browser navigates to `/inventory.html` and displays **Products**.
- **Actual result** · The browser opened `/inventory.html` and displayed **Products**.
- **Execution status** · Passed

### LOGIN-002 · Reject an incorrect password

- **Priority** · High
- **Preconditions** · Common precondition.
- **Test data** · Username `standard_user`, password `wrong_password`.
- **Steps** · Enter the username and password, then click **Login**.
- **Expected result** · The login page remains open and shows `Epic sadface: Username and password do not match any user in this service`.
- **Actual result** · The login form showed the expected credential error.
- **Execution status** · Passed

### LOGIN-003 · Reject a locked-out user

- **Priority** · High
- **Preconditions** · Common precondition.
- **Test data** · Username `locked_out_user`, password `secret_sauce`.
- **Steps** · Enter the username and password, then click **Login**.
- **Expected result** · The login page remains open and shows `Epic sadface: Sorry, this user has been locked out.`
- **Actual result** · The login form showed the expected lockout error.
- **Execution status** · Passed

### LOGIN-004 · Validate an empty login form

- **Priority** · Medium
- **Preconditions** · Common precondition.
- **Test data** · Both fields blank.
- **Steps** · Leave both fields blank and click **Login**.
- **Expected result** · The login page remains open and shows `Epic sadface: Username is required` as the first validation message.
- **Actual result** · The login form showed the username-required error.
- **Execution status** · Passed

### LOGIN-005 · Validate a missing password

- **Priority** · Medium
- **Preconditions** · Common precondition.
- **Test data** · Username `standard_user`, password blank.
- **Steps** · Enter the username, leave **Password** blank, and click **Login**.
- **Expected result** · The login page remains open and shows `Epic sadface: Password is required`.
- **Actual result** · The login form showed the password-required error.
- **Execution status** · Passed

### LOGIN-006 · Dismiss a login error

- **Priority** · Low, since dismissal is a convenience and the form remains available.
- **Preconditions** · Start on the signed-out login page. Click **Login** with both fields blank to display the username-required alert.
- **Test data** · Both fields blank.
- **Steps** · Click **Dismiss error** on the alert.
- **Expected result** · The alert and its dismissal button disappear. The username field, password field, and **Login** button remain available.
- **Actual result** · The alert and dismissal button disappeared. Both fields and the **Login** button remained visible.
- **Execution status** · Passed

### LOGIN-007 · Reject login with an empty username and populated password

- **Priority** · Medium
- **Preconditions** · User is signed out and on the login page.
- **Test data** · Login is blank, password `secret_sauce`.
- **Steps** · Leave login field blank, fill password field and click **Login**.
- **Expected result** · The user remains on the login page and sees Epic sadface: Username is required.
- **Actual result** · The application displays Epic sadface: Username is required.
- **Execution status** · Passed, once both expected conditions are confirmed.