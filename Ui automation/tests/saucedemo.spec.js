const { test, expect } = require('@playwright/test');

const PASSWORD = process.env.SAUCE_PASSWORD;

// Convert price text like "$29.99" to number 29.99
function parsePrice(text) {
  return Number(text.replace(/[^0-9.]/g, ''));
}

// Login function
async function login(page, username) {
  await page.goto('/');

  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('#login-button').click();
}

// Reset App State from hamburger menu
async function resetAppState(page) {
  await page.locator('#react-burger-menu-btn').click();

  await expect(page.locator('#reset_sidebar_link')).toBeVisible();

  await page.locator('#reset_sidebar_link').click();

  // Close hamburger menu
  await page.keyboard.press('Escape');
}

// Logout function
async function logout(page) {
  await page.locator('#react-burger-menu-btn').click();

  await expect(page.locator('#logout_sidebar_link')).toBeVisible();

  await page.locator('#logout_sidebar_link').click();

  await expect(page.locator('#login-button')).toBeVisible();
}

// Checkout form function
async function checkout(page) {
  await page.locator('.shopping_cart_link').click();

  await expect(page).toHaveURL(/cart/);

  await page.locator('#checkout').click();

  await page.locator('#first-name').fill('Test');
  await page.locator('#last-name').fill('User');
  await page.locator('#postal-code').fill('1207');

  await page.locator('#continue').click();

  await expect(page).toHaveURL(/checkout-step-two/);
}

// Verify product names and total price
async function verifyCheckoutProductsAndTotal(page, expectedProducts) {
  const checkoutNames = page.locator('.cart_item .inventory_item_name');

  await expect(checkoutNames).toHaveText(
    expectedProducts.map(product => product.name)
  );

  const expectedItemTotal = expectedProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const subtotalText = await page.locator('.summary_subtotal_label').innerText();
  const taxText = await page.locator('.summary_tax_label').innerText();
  const totalText = await page.locator('.summary_total_label').innerText();

  const actualSubtotal = parsePrice(subtotalText);
  const actualTax = parsePrice(taxText);
  const actualTotal = parsePrice(totalText);

  expect(actualSubtotal).toBeCloseTo(expectedItemTotal, 2);
  expect(actualTotal).toBeCloseTo(actualSubtotal + actualTax, 2);
}

// Finish order and verify success message
async function finishOrderAndVerifySuccess(page) {
  await page.locator('#finish').click();

  await expect(page.locator('.complete-header')).toHaveText(
    'Thank you for your order!'
  );

  await expect(page.locator('.complete-text')).toContainText(
    'Your order has been dispatched'
  );
}

test.describe('SauceDemo UI Automation Assessment', () => {
  test('Login with locked_out_user and verify error message', async ({ page }) => {
    await login(page, 'locked_out_user');

    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('Standard_user adds 3 items, checkout, verify total, finish order, reset and logout', async ({ page }) => {
    await login(page, 'standard_user');

    await expect(page).toHaveURL(/inventory/);

    await resetAppState(page);

    const selectedProducts = [];

    const productItems = page.locator('.inventory_item');

    for (let i = 0; i < 3; i++) {
      const product = productItems.nth(i);

      const name = await product.locator('.inventory_item_name').innerText();
      const priceText = await product.locator('.inventory_item_price').innerText();
      const price = parsePrice(priceText);

      selectedProducts.push({
        name,
        price
      });

      await product.locator('button').click();
    }

    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    await checkout(page);

    await verifyCheckoutProductsAndTotal(page, selectedProducts);

    await finishOrderAndVerifySuccess(page);

    await resetAppState(page);

    await logout(page);
  });

  test('Performance_glitch_user filters Z to A, adds first item, checkout, verify total, finish order, reset and logout', async ({ page }) => {
    test.slow();

    await login(page, 'performance_glitch_user');

    await expect(page).toHaveURL(/inventory/, { timeout: 30000 });

    await resetAppState(page);

    await page.locator('.product_sort_container').selectOption('za');

    const firstProduct = page.locator('.inventory_item').first();

    const name = await firstProduct.locator('.inventory_item_name').innerText();
    const priceText = await firstProduct.locator('.inventory_item_price').innerText();
    const price = parsePrice(priceText);

    const selectedProducts = [
      {
        name,
        price
      }
    ];

    await firstProduct.locator('button').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await checkout(page);

    await verifyCheckoutProductsAndTotal(page, selectedProducts);

    await finishOrderAndVerifySuccess(page);

    await resetAppState(page);

    await logout(page);
  });
});