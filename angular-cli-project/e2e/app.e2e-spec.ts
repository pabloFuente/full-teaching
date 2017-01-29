import { browser, element, by } from 'protractor/globals';

import { AngularCliProjectPage } from './app.po';

describe('angular-cli-project App', function() {
  let page: AngularCliProjectPage;

  beforeEach(() => {
    page = new AngularCliProjectPage();
  });

  it('should display title in the navbar', () => {
    page.navigateTo();
    expect(page.getLogoText()).toEqual('FullTeaching');
  });

  it('should log in', () => {

    //Open login modal
    var loginBtn = browser.driver.findElement(by.id('download-button'));
    loginBtn.click();

    // Find page elements
    var userNameField = browser.driver.findElement(by.id('email'));
    var userPassField = browser.driver.findElement(by.id('password'));
    var userLoginBtn = browser.driver.findElement(by.id('log-in-btn'));

    // Fill input fields
    userNameField.sendKeys('teacher@gmail.com');
    userPassField.sendKeys('pass');

    // Ensure fields contain what we've entered
    expect(userNameField.getAttribute('value')).toEqual('teacher@gmail.com');
    expect(userPassField.getAttribute('value')).toEqual('pass');

    // Click to log in - waiting for Angular as it is manually bootstrapped.
    userLoginBtn.click().then(function() {
      browser.waitForAngular();
      expect(browser.driver.getCurrentUrl()).toMatch('/courses');
    });
  });
});
