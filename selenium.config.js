import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

// Configure Selenium WebDriver
const setupDriver = async () => {
  const options = new chrome.Options();
  // Add any Chrome-specific options here
  options.addArguments('--headless'); // Run tests without opening browser window
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
    
  return driver;
};

// Cleanup function to close browser after tests
const teardownDriver = async (driver) => {
  if (driver) {
    await driver.quit();
  }
};

export {
  setupDriver,
  teardownDriver
};