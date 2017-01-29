import { browser, element, by } from 'protractor/globals';

export class AngularCliProjectPage {
  navigateTo() {
    return browser.get('/');
  }

  getLogoText() {
    return element(by.css('#logo-container')).getText();
  }
}
