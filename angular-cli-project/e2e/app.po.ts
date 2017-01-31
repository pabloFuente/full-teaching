import { browser, element, by, protractor } from 'protractor/globals';

export class AngularCliProjectPage {
  navigateTo() {
    return browser.get('/');
  }

  getLogoText() {
    return element(by.css('#logo-container')).getText();
  }

  waitForAnimation(){
    browser.sleep(500);
  }

  waitSeconds(seconds: number){
    browser.sleep(seconds*1000);
  }

  securePresence(selector: string){
    var i = element(by.css(selector));
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(i), 3000); // Max 3 seconds
  }
}
