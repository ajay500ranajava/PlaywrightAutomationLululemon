import testData from "../test-data/testData.json";
import { test, expect } from '@playwright/test';

test('Search employee and validate details in OrangeHRM', async ({ page }) => {
  // 1. Login into application
  //await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
//await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
test.setTimeout(120000); // set higher test timeout
await page.goto(testData.url.orangeHrmUrl, {
  waitUntil: 'networkidle',
  timeout: 90000
});
;

//  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.fill('input[name="username"]', testData.validUser.username);
  await page.fill('input[name="password"]', testData.validUser.password);
  await page.click('button[type="submit"]');

  // 2. Navigate to PIM -> Employee List tab.
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();

  // 3. Enter a valid employee name in "Employee Name" field
  const searchEmployee = "Ajay Rana"; // employee to search Linda Anderson
  await page.fill('input[placeholder="Type for hints..."]', testData.employee.searchName);
  

  /*const empId = "450"; // 
  await page.fill('input.oxd-input oxd-input--active', empId);*/

  // 4. Click on Search button
  await page.click('button:has-text("Search")');

  // 5. Verify "Employee Information" text is displayed
  await expect(page.locator('h5:has-text("Employee Information")')).toBeVisible();

  // 6. Wait for either Record Found OR No Records Found
  const recordFound = page.locator("div.oxd-table-card");
  const noRecord = page.locator("span.oxd-text:has-text('No Records Found')");

  // Race condition: wait until one of them appears
  await Promise.race([
    recordFound.first().waitFor({ state: 'visible', timeout: 20000 }),
    noRecord.waitFor({ state: 'visible', timeout: 20000 })
  ]);

  if (await noRecord.isVisible()) {
    throw new Error(`❌ No Records Found for employee: ${searchEmployee}`);
  }

  // 7. Click on the first returned result
  //await page.locator(`//div[text()='${empId}']`).click();
  const firstRow = recordFound.first();
  //first comment added -2
  await firstRow.click();

  // 8. Verify Personal Details screen with Employee Name displayed
  await expect(page.locator('h6:has-text("Personal Details")')).toBeVisible();

  // Just validate that First Name input is not empty 
  const firstNameField = page.locator('input[name="firstName"]');
  await expect(firstNameField).not.toHaveValue('');

 
  // 9. Validate Employee ID field is not empty
  /*const empIdField = page.locator('input[name="employeeId"]');
  await expect(empIdField).toHaveValue(empId);*/

  //console.log("✅ Employee ID matched:", await empIdField.inputValue());

  // Optionally log the actual value
  console.log("Employee first name is:", await firstNameField.inputValue());
  //tc passed
});
