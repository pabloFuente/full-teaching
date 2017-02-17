import { browser, element, by, protractor } from 'protractor/globals';

export class AngularCliProjectPage {
  navigateTo() {
    return browser.get('/');
  }

  getLogoText() {
    return element(by.css('#logo-container')).getText();
  }

  waitForAnimation() {
    browser.sleep(500);
  }

  waitSeconds(seconds: number) {
    browser.sleep(seconds*1000);
  }

  waitUntilElementPresent(selector: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.css(selector))), 5000, 'Element ' + selector + ' taking too long to appear in the DOM');
  }

  waitUntilElementVisible(selector: string) {
    browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.css(selector))), 5000, 'Element ' + selector + ' is not visible');
  }

  waitUntilElementNotVisible(selector: string) {
    browser.wait(protractor.ExpectedConditions.invisibilityOf(element(by.css(selector))), 5000, 'Element ' + selector + ' is still visible');
  }
}
