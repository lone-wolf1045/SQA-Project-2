# Automation Testing Assessment

This project contains two parts of the automation testing assessment:

1. **UI Automation** using Playwright with JavaScript for [SauceDemo](https://www.saucedemo.com/)
2. **API Automation** using Postman for [ReqRes API](https://reqres.in/api)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Part 1: UI Automation](#part-1-ui-automation)
  - [Technology Used](#technology-used)
  - [UI Test Scenarios](#ui-test-scenarios)
  - [Project Setup in VS Code](#project-setup-in-vs-code)
  - [Environment Variables](#environment-variables)
  - [How to Run UI Tests](#how-to-run-ui-tests)
  - [How to Run Tests Slowly](#how-to-run-tests-slowly)
  - [UI Test File Structure](#ui-test-file-structure)
- [Part 2: API Automation](#part-2-api-automation)
  - [Technology Used](#technology-used-1)
  - [Base URL](#base-url)
  - [API Environment Variables](#api-environment-variables)
  - [API Collection Structure](#api-collection-structure)
  - [API Test Scenarios](#api-test-scenarios)
  - [Required Header](#required-header)
  - [How to Run API Tests in Postman](#how-to-run-api-tests-in-postman)
  - [How to Export Postman Files](#how-to-export-postman-files)
- [Troubleshooting](#troubleshooting)
- [Submission Files](#submission-files)

---

# Project Overview

This assessment validates both UI and API automation skills.

The UI automation part tests login, cart, checkout, product verification, price verification, order completion, reset app state, and logout functionality on SauceDemo.

The API automation part tests login, token capture, GET user verification, PUT update, PATCH update, and negative test cases using ReqRes API in Postman.

---

# Part 1: UI Automation

## Technology Used

- JavaScript
- Playwright
- Node.js
- VS Code
- dotenv

---

## UI Test Scenarios

### Q1: Locked Out User Login

**Requirement:**

Login with `locked_out_user` and verify the error message.

**Expected Result:**

The system should show the following error message:

```text
Epic sadface: Sorry, this user has been locked out.
```

---

### Q2: Standard User Checkout Journey

**Requirement:**

1. Login with `standard_user`
2. Reset App State from hamburger menu
3. Add any three products to the cart
4. Navigate to cart
5. Continue to checkout
6. Fill checkout information
7. Navigate to final checkout page
8. Verify product names
9. Verify total price
10. Finish the purchase journey
11. Verify successful order message
12. Reset App State again
13. Logout

**Expected Success Message:**

```text
Thank you for your order!
```

---

### Q3: Performance Glitch User Checkout Journey

**Requirement:**

1. Login with `performance_glitch_user`
2. Reset App State
3. Filter products by Name Z to A
4. Add the first product to the cart
5. Navigate to final checkout page
6. Verify product name
7. Verify total price
8. Finish the purchase journey
9. Verify successful order message
10. Reset App State again
11. Logout

---

# Project Setup in VS Code

## Step 1: Create Project Folder

Create a folder named:

```text
saucedemo-automation
```

Open the folder in VS Code.

---

## Step 2: Initialize Playwright Project

Open the VS Code terminal and run:

```bash
npm init playwright@latest
```

Select the following options:

```text
Language: JavaScript
Test folder: tests
GitHub Actions: No
Install Playwright browsers: Yes
```

---

## Step 3: Install dotenv

Run:

```bash
npm install -D dotenv
```

---

## Step 4: Create `.env` File

Create a file named `.env` in the project root.

Add:

```env
BASE_URL=https://www.saucedemo.com
SAUCE_PASSWORD=secret_sauce
```

---

## Step 5: Update `playwright.config.js`

Use the following configuration:

```javascript
require('dotenv').config();

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests',
  testMatch: '**/*.spec.js',

  timeout: 60000,

  use: {
    baseURL: process.env.BASE_URL,
    browserName: 'chromium',
    headless: false,

    launchOptions: {
      slowMo: 1000
    },

    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  reporter: [['html'], ['list']]
};

module.exports = config;
```

---

# Environment Variables

The UI automation uses the following variables:

| Variable | Value |
|---|---|
| `BASE_URL` | `https://www.saucedemo.com` |
| `SAUCE_PASSWORD` | `secret_sauce` |

---

# How to Run UI Tests

Run all UI tests:

```bash
npx playwright test
```

Run tests with visible browser:

```bash
npx playwright test --headed
```

Run tests using npm script:

```bash
npm run test:headed
```

Open Playwright report:

```bash
npx playwright show-report
```

---

# How to Run Tests Slowly

To slow down the execution, use `slowMo` inside `playwright.config.js`:

```javascript
launchOptions: {
  slowMo: 1000
}
```

This slows each browser action by 1 second.

You can increase or decrease the value:

```javascript
slowMo: 500
```

Half second delay.

```javascript
slowMo: 2000
```

Two seconds delay.

---

# UI Test File Structure

Recommended project structure:

```text
saucedemo-automation
│
├── .env
├── package.json
├── package-lock.json
├── playwright.config.js
│
└── tests
    └── saucedemo.spec.js
```

---

# Part 2: API Automation

## Technology Used

- Postman
- JavaScript test scripts inside Postman
- ReqRes API
- Environment variables

---

# Base URL

```text
https://reqres.in/api
```

---

# API Environment Variables

Create a Postman environment named:

```text
ReqRes Environment
```

Add the following variables:

| Variable | Value |
|---|---|
| `baseUrl` | `https://reqres.in/api` |
| `apiKey` | `reqres-free-v1` |
| `email` | `eve.holt@reqres.in` |
| `password` | `cityslicka` |
| `userId` | `2` |
| `authToken` | Empty initially |
| `expectedFirstName` | `Janet` |
| `expectedLastName` | `Weaver` |
| `expectedEmail` | `janet.weaver@reqres.in` |
| `updatedName` | `Morpheus` |
| `updatedJob` | `QA Engineer` |
| `patchedJob` | `Senior QA Engineer` |
| `invalidUserId` | `23` |

Make sure the environment is selected before running requests.

---

# API Collection Structure

Create a Postman collection named:

```text
ReqRes API Automation Assessment
```

Recommended folder structure:

```text
ReqRes API Automation Assessment
│
├── Authentication
│   └── Q3 - Login and Capture Auth Token
│
├── User API
│   ├── Q4 - Get User and Verify Name Email
│   ├── Q5 - PUT Update Profile and Verify updatedAt
│   └── Q6 - PATCH Single Field and Verify
│
└── Negative Test Cases
    ├── Q8A - Bad Login Missing Password
    ├── Q8B - Bad Get Invalid User
    └── Q8C - Bad Register Missing Password
```

---

# API Test Scenarios

## Q3: Login with Registered Credentials and Capture Auth Token

**Method:**

```text
POST
```

**Endpoint:**

```text
{{baseUrl}}/login
```

**Body:**

```json
{
  "email": "{{email}}",
  "password": "{{password}}"
}
```

**Post-response Script:**

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const response = pm.response.json();

pm.test("Auth token is present", function () {
    pm.expect(response).to.have.property("token");
    pm.expect(response.token).to.not.be.empty;
});

pm.environment.set("authToken", response.token);
```

---

## Q4: GET User by User ID and Verify Name and Email

**Method:**

```text
GET
```

**Endpoint:**

```text
{{baseUrl}}/users/{{userId}}
```

**Post-response Script:**

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const response = pm.response.json();
const user = response.data;

pm.test("User ID matches", function () {
    pm.expect(user.id).to.eql(Number(pm.environment.get("userId")));
});

pm.test("First name matches", function () {
    pm.expect(user.first_name).to.eql(pm.environment.get("expectedFirstName"));
});

pm.test("Last name matches", function () {
    pm.expect(user.last_name).to.eql(pm.environment.get("expectedLastName"));
});

pm.test("Email matches", function () {
    pm.expect(user.email).to.eql(pm.environment.get("expectedEmail"));
});

pm.environment.set("originalFirstName", user.first_name);
pm.environment.set("originalLastName", user.last_name);
pm.environment.set("originalEmail", user.email);
```

---

## Q5: PUT Updated Profile and Verify updatedAt Timestamp

**Method:**

```text
PUT
```

**Endpoint:**

```text
{{baseUrl}}/users/{{userId}}
```

**Body:**

```json
{
  "name": "{{updatedName}}",
  "job": "{{updatedJob}}"
}
```

**Post-response Script:**

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const response = pm.response.json();

pm.test("Updated name is correct", function () {
    pm.expect(response.name).to.eql(pm.environment.get("updatedName"));
});

pm.test("Updated job is correct", function () {
    pm.expect(response.job).to.eql(pm.environment.get("updatedJob"));
});

pm.test("updatedAt timestamp is present", function () {
    pm.expect(response).to.have.property("updatedAt");
    pm.expect(response.updatedAt).to.not.be.empty;
});

pm.test("updatedAt is a valid date", function () {
    const updatedAt = new Date(response.updatedAt);
    pm.expect(updatedAt.toString()).to.not.eql("Invalid Date");
});

pm.environment.set("putUpdatedAt", response.updatedAt);
```

---

## Q6: PATCH Single Field and Verify Only That Field Changed

**Method:**

```text
PATCH
```

**Endpoint:**

```text
{{baseUrl}}/users/{{userId}}
```

**Body:**

```json
{
  "job": "{{patchedJob}}"
}
```

**Post-response Script:**

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const response = pm.response.json();

pm.test("Patched job is correct", function () {
    pm.expect(response.job).to.eql(pm.environment.get("patchedJob"));
});

pm.test("updatedAt timestamp is present", function () {
    pm.expect(response).to.have.property("updatedAt");
    pm.expect(response.updatedAt).to.not.be.empty;
});

pm.test("updatedAt is a valid date", function () {
    const updatedAt = new Date(response.updatedAt);
    pm.expect(updatedAt.toString()).to.not.eql("Invalid Date");
});

pm.test("Name field is not changed in PATCH response", function () {
    pm.expect(response).to.not.have.property("name");
});

pm.environment.set("patchUpdatedAt", response.updatedAt);
```

---

## Q8A: Bad Login Missing Password

**Method:**

```text
POST
```

**Endpoint:**

```text
{{baseUrl}}/login
```

**Body:**

```json
{
  "email": "{{email}}"
}
```

**Post-response Script:**

```javascript
pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
});

const response = pm.response.json();

pm.test("Error message is returned", function () {
    pm.expect(response).to.have.property("error");
    pm.expect(response.error).to.not.be.empty;
});
```

---

## Q8B: Bad GET Invalid User

**Method:**

```text
GET
```

**Endpoint:**

```text
{{baseUrl}}/users/{{invalidUserId}}
```

**Post-response Script:**

```javascript
pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
});

pm.test("Response body is empty object", function () {
    const response = pm.response.json();
    pm.expect(response).to.be.an("object");
    pm.expect(Object.keys(response).length).to.eql(0);
});
```

---

## Q8C: Bad Register Missing Password

**Method:**

```text
POST
```

**Endpoint:**

```text
{{baseUrl}}/register
```

**Body:**

```json
{
  "email": "{{email}}"
}
```

**Post-response Script:**

```javascript
pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
});

const response = pm.response.json();

pm.test("Error message is returned", function () {
    pm.expect(response).to.have.property("error");
    pm.expect(response.error).to.not.be.empty;
});
```

---

# Required Header

ReqRes API requires the following header for `/api` endpoints:

| Key | Value |
|---|---|
| `x-api-key` | `{{apiKey}}` |
| `Content-Type` | `application/json` |

Optional after login:

| Key | Value |
|---|---|
| `Authorization` | `Bearer {{authToken}}` |

---

# How to Run API Tests in Postman

## Run Individual Request

1. Open the request.
2. Click **Send**.
3. Check the response body.
4. Open **Test Results** to verify passed/failed tests.

## Run Full Collection

1. Open the collection.
2. Click **Run Collection**.
3. Select the environment: `ReqRes Environment`.
4. Click **Run**.
5. Review the test results.

Recommended running order:

```text
1. Q3 - Login and Capture Auth Token
2. Q4 - Get User and Verify Name Email
3. Q5 - PUT Update Profile and Verify updatedAt
4. Q6 - PATCH Single Field and Verify
5. Q8A - Bad Login Missing Password
6. Q8B - Bad Get Invalid User
7. Q8C - Bad Register Missing Password
```

---

# How to Export Postman Files

## Export Collection

1. Go to **Collections**
2. Click the three dots beside the collection name
3. Click **Export**
4. Choose **Collection v2.1**
5. Save the file

Expected file:

```text
ReqRes API Automation Assessment.postman_collection.json
```

## Export Environment

1. Go to **Environments**
2. Select `ReqRes Environment`
3. Click the three dots
4. Click **Export**
5. Save the file

Expected file:

```text
ReqRes Environment.postman_environment.json
```

---

# Troubleshooting

## UI Automation: No Tests Found

Check:

```text
tests/saucedemo.spec.js
```

The file must be inside the `tests` folder and must end with `.spec.js`.

---

## UI Automation: Cannot Find Module `@playwright/test`

Run:

```bash
npm install -D @playwright/test
```

Then run:

```bash
npx playwright install
```

---

## UI Automation: Browser Runs Too Fast

Add this inside `playwright.config.js`:

```javascript
launchOptions: {
  slowMo: 1000
}
```

---

## API Automation: Missing API Key Error

If you get:

```json
{
  "error": "missing_api_key",
  "message": "The x-api-key header is required for this endpoint."
}
```

Add this header:

```text
x-api-key: {{apiKey}}
```

Also make sure the environment variable exists:

```text
apiKey = reqres-free-v1
```

And make sure the correct environment is selected in Postman.

---

## API Automation: Variables Not Working

Check that your environment is selected in the top-right corner of Postman.

Also check both Initial Value and Current Value for each variable.

---

# Submission Files

Recommended files for submission:

```text
saucedemo-automation/
ReqRes API Automation Assessment.postman_collection.json
ReqRes Environment.postman_environment.json
README.md
```

The UI automation folder should include:

```text
.env
package.json
package-lock.json
playwright.config.js
tests/saucedemo.spec.js
```

The Postman part should include:

```text
ReqRes API Automation Assessment.postman_collection.json
ReqRes Environment.postman_environment.json
```

---

# Conclusion

This assessment covers end-to-end automation testing skills using both UI and API automation.

The UI automation verifies user login, product selection, checkout, order completion, app reset, and logout functionality.

The API automation verifies successful login, token capture, user retrieval, update operations, partial update operations, and negative test cases with proper 4xx validation.
