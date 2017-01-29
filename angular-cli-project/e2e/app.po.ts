import { browser, element, by } from 'protractor/globals';

export class AngularCliProjectPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('#logo-container')).getText();
  }
}
