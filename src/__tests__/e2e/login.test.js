import { expect } from 'chai';
import { setupDriver, teardownDriver } from '../../../selenium.config.js';
import { By, until } from 'selenium-webdriver';

describe('Login Page Tests', function() {
  this.timeout(20000); // Increase timeout to 10 seconds
  let driver;

  before(async function() {
    driver = await setupDriver();
  });

  after(async function() {
    await teardownDriver(driver);
  });

  beforeEach(async function() {
    await driver.get('http://localhost:8080/login');
  });

  it('should successfully login with valid credentials', async function() {
    // Find and fill email input
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys('admin@example.com');

    // Find and fill password input
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys('admin123');

    // Click login button
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await loginButton.click();

    // Wait for navigation to dashboard
    await driver.wait(until.urlContains('/'), 5000);

    // Verify successful login by checking URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/');
  });

  it('should show error message for non-existent user', async function() {
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys('wrong@example.com');

    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys('nkjdbdkj');

    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await loginButton.click();

    // Wait for error message to appear
    const errorMessage = await driver.wait(
      until.elementLocated(By.css('[role="alert"]')),
      5000
    );

    const errorText = await errorMessage.getText();
    expect(errorText).to.include('Invalid credentials');
  });

  it('should show error message for incorrect password', async function() {
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys('admin@example.com');

    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys('wrongpassword');

    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await loginButton.click();

    // Wait for error message to appear
    const errorMessage = await driver.wait(
      until.elementLocated(By.css('[role="alert"]')),
      5000
    );

    const errorText = await errorMessage.getText();
    expect(errorText).to.include('Invalid credentials');
  });
});