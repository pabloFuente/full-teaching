import { browser, element, by, protractor } from 'protractor/globals';

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

  it('should reject wrong log in', () => {

    //Open login modal
    var loginBtn = browser.driver.findElement(by.id('download-button'));
    loginBtn.click();

    // Find page elements
    var userNameField = browser.driver.findElement(by.id('email'));
    var userPassField = browser.driver.findElement(by.id('password'));
    var userLoginBtn = browser.driver.findElement(by.id('log-in-btn'));

    // Fill input fields
    userNameField.sendKeys('wrongemail@gmail.com');
    userPassField.sendKeys('pass');

    // Ensure fields contain what we've entered
    expect(userNameField.getAttribute('value')).toEqual('wrongemail@gmail.com');
    expect(userPassField.getAttribute('value')).toEqual('pass');

    // Click to log in - waiting for Angular as it is manually bootstrapped.
    userLoginBtn.click().then(function() {
      browser.waitForAngular();

      //Error message appears warning about an invalid field
      expect(browser.driver.findElement(by.tagName('app-error-message')).getText()).toContain('Invalid field');
      //Route mustn't change
      expect(browser.driver.getCurrentUrl()).toMatch('/');

      //Clearing inputs
      userNameField.clear();
      userPassField.clear();
    });
  });

  it('should log in', () => {
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


  it('should allow adding new courses', () => {

    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    //Open modal for adding a course
    var addCourseIcon = browser.driver.findElement(by.id('add-course-icon'));
    addCourseIcon.click();

    browser.sleep(500);

    // Find page elements
    var courseNameField = browser.driver.findElement(by.id('inputPostCourseName'));
    var submitNewCourseBtn = browser.driver.findElement(by.id('submit-post-course-btn'));

    // Fill input fields
    courseNameField.sendKeys('New testing course');

    // Ensure fields contain what we've entered
    expect(courseNameField.getAttribute('value')).toEqual('New testing course');

    // Click to log in - waiting for Angular as it is manually bootstrapped.
    submitNewCourseBtn.click().then(function() {
      browser.waitForAngular();

      //The last course should be the recently added
      var courses = element.all(by.className('course-title'));
      expect(courses.last().getText()).toContain('New testing course');

      //Clearing inputs
      courseNameField.clear();
    });
  });


  it('should allow editing courses', () => {

    var EC = protractor.ExpectedConditions;

    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    var lastEditCoursesIcon = element.all(by.className('course-put-icon')).last();

    browser.sleep(500);
    lastEditCoursesIcon.click();
    browser.sleep(500);

    var courseNameField = browser.driver.findElement(by.id('inputPutCourseName'));
    var submitEditCourseBtn = browser.driver.findElement(by.id('submit-put-course-btn'));

    courseNameField.sendKeys('[EDITED]');

    // Ensure fields contain what we've entered
    expect(courseNameField.getAttribute('value')).toEqual('New testing course[EDITED]');

    // Click to log in - waiting for Angular as it is manually bootstrapped.
    submitEditCourseBtn.click().then(function() {
      browser.waitForAngular();

      var editedCourse = element.all(by.className('course-title')).last();
      expect(editedCourse.getText()).toEqual('New testing course[EDITED]');
    });
  });


  it('should allow removing courses', () => {

    var EC = protractor.ExpectedConditions;
    var courses1 = element.all(by.className('course-title'));
    var i = courses1.count;

    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    var lastEditCoursesIcon = element.all(by.className('course-put-icon')).last();

    browser.sleep(500);
    lastEditCoursesIcon.click();
    browser.sleep(500);

    var deletionAllow = browser.driver.findElement(by.css('label[for=delete-checkbox]'));
    deletionAllow.click();

    var deleteButton = browser.driver.findElement(by.css('div.delete-div a.btn-flat'));

    deleteButton.click().then(function() {
      browser.waitForAngular();

      var courses2 = element.all(by.className('course-title'));
      var j = courses2.count;

      //Should be exactly one course less than before the deletion
      expect(Number(j.toString()) === (Number(i.toString()) - 1));
    });
  });



});
