import { browser, element, by, protractor } from 'protractor/globals';

import { AngularCliProjectPage } from './app.po';

describe('angular-cli-project App', function() {
  let page: AngularCliProjectPage;
  browser.driver.manage().window().maximize();

  beforeEach(() => {
    page = new AngularCliProjectPage();
  });


  it('should display title in the navbar', () => {
    page.navigateTo();

    // Check browser url (root)
    expect(browser.driver.getCurrentUrl()).toMatch('/');

    // The menu bar should display the title of the app
    expect(page.getLogoText()).toEqual('FullTeaching');
  });


  it('should reject wrong log in', () => {

    // Check browser url (root)
    expect(browser.driver.getCurrentUrl()).toMatch('/');

    // Open login modal
    var loginBtn = browser.driver.findElement(by.id('download-button'));
    loginBtn.click();

    // Find form elements
    var userNameField = browser.driver.findElement(by.id('email'));
    var userPassField = browser.driver.findElement(by.id('password'));
    var userLoginBtn = browser.driver.findElement(by.id('log-in-btn'));

    // Fill input fields
    userNameField.sendKeys('wrongemail@gmail.com');
    userPassField.sendKeys('pass');

    // Ensure fields contain what has been entered
    expect(userNameField.getAttribute('value')).toEqual('wrongemail@gmail.com');
    expect(userPassField.getAttribute('value')).toEqual('pass');

    // Click to log in - waiting for Angular as it is manually bootstrapped.
    userLoginBtn.click().then(function() {
      browser.waitForAngular();

      // Error message appears warning about an invalid field
      expect(browser.driver.findElement(by.tagName('app-error-message')).getText()).toContain('Invalid field');
      //Route mustn't change
      expect(browser.driver.getCurrentUrl()).toMatch('/');

      // Clear field inputs
      userNameField.clear();
      userPassField.clear();
    });
  });


  it('should log in', () => {

    // Check browser url (root)
    expect(browser.driver.getCurrentUrl()).toMatch('/');

    // Find form elements (login modal is already opened)
    var userNameField = browser.driver.findElement(by.id('email'));
    var userPassField = browser.driver.findElement(by.id('password'));
    var userLoginBtn = browser.driver.findElement(by.id('log-in-btn'));

    // Fill input fields
    userNameField.sendKeys('teacher@gmail.com');
    userPassField.sendKeys('pass');

    // Ensure fields contain what has been entered
    expect(userNameField.getAttribute('value')).toEqual('teacher@gmail.com');
    expect(userPassField.getAttribute('value')).toEqual('pass');

    // Click to log in - waiting for Angular as it is manually bootstrapped.
    userLoginBtn.click().then(function() {
      browser.waitForAngular();

      // Browser url must have changed to the dashboard route
      expect(browser.driver.getCurrentUrl()).toMatch('/courses');
    });
  });


  it('should allow adding new courses', () => {

    // Check browser url (dashboard)
    expect(browser.driver.getCurrentUrl()).toMatch('/courses');
    page.waitForAnimation();

    // Open modal for adding a course
    var addCourseIcon = browser.driver.findElement(by.id('add-course-icon'));
    addCourseIcon.click();
    page.waitForAnimation();

    // Find form elements
    var courseNameField = browser.driver.findElement(by.id('inputPostCourseName'));
    var submitNewCourseBtn = browser.driver.findElement(by.id('submit-post-course-btn'));

    // Fill input fields
    courseNameField.sendKeys('New testing course');

    // Ensure fields contain what has been entered
    expect(courseNameField.getAttribute('value')).toEqual('New testing course');

    // Click submit form
    submitNewCourseBtn.click().then(function() {
      browser.waitForAngular();

      // The last course should be the one that has been just added
      var courses = element.all(by.className('course-title'));
      expect(courses.last().getText()).toContain('New testing course');

      // Clear field inputs
      courseNameField.clear();
    });
  });


  it('should allow editing courses', () => {

    // Check browser url (dashboard)
    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    // Get and click the button to edit the last one of the courses
    var lastEditCoursesIcon = element.all(by.className('course-put-icon')).last();
    page.waitForAnimation();
    lastEditCoursesIcon.click();
    page.waitForAnimation();

    // Get field inputs
    var courseNameField = browser.driver.findElement(by.id('inputPutCourseName'));
    var submitEditCourseBtn = browser.driver.findElement(by.id('submit-put-course-btn'));

    // Fill input field
    courseNameField.sendKeys('[EDITED]');

    // Ensure field contains what has been entered
    expect(courseNameField.getAttribute('value')).toEqual('New testing course[EDITED]');

    // Click submit form
    submitEditCourseBtn.click().then(function() {
      browser.waitForAngular();

      //The last course should have changed its name
      var editedCourse = element.all(by.className('course-title')).last();
      expect(editedCourse.getText()).toEqual('New testing course[EDITED]');
    });
  });


  it('should allow removing courses', () => {

    // Check browser url (dashboard)
    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    // Get the number of courses present in the dashboard
    var courses1 = element.all(by.className('course-title'));
    var i = courses1.count;

    // Get and click the button to edit the last one of the courses
    var lastEditCoursesIcon = element.all(by.className('course-put-icon')).last();
    page.waitForAnimation();
    lastEditCoursesIcon.click();
    page.waitForAnimation();

    // Get and click the checkbox to allow the course's deletion
    var deletionAllow = browser.driver.findElement(by.css('label[for=delete-checkbox]'));
    deletionAllow.click();

    // Get and click the button to delete the course
    var deleteButton = browser.driver.findElement(by.css('div.delete-div a.btn-flat'));
    deleteButton.click().then(function() {
      browser.waitForAngular();

      // Get the number of courses present in the dashboard
      var courses2 = element.all(by.className('course-title'));
      var j = courses2.count;

      // Should be exactly one course less than before the deletion
      expect(Number(j.toString()) === (Number(i.toString()) - 1));
    });
  });


  it('should allow navigation to sessions directly from calendar', () => {

    // Check browser url (dashboard)
    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    // Get and click the last one of the indicators of session inside the calendar view
    var lastSessionIndicatorOfMonth = element.all(by.css('.cal-in-month.cal-has-events .cal-day-badge')).last();
    page.waitForAnimation();
    lastSessionIndicatorOfMonth.click();

    // Get the text of the last of the opened session's shortcuts inside the calendar view
    element.all(by.css('a.cal-event-title')).last().getText().then(function(text) {

      var sessionName = text;

      // Get and click the last of the shortcut links to sessions
      var iconToSession = element.all(by.css('i.material-icons.calendar-event-icon')).last();
      iconToSession.click().then(function() {
        browser.waitForAngular();

        // Browser url must have changed to the course details page, with the session's tab opened (/courses/[number]/1)
        expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/1/);

        // Get all the titles of sessions in the course-details page
        var sessionTitles = element.all(by.css('div.session-title'));

        // Get the session element whose title is equal to the other in the calendar view
        sessionTitles.filter(function(title) {
          return title.getText().then(function(text) {
            return (sessionName.indexOf(text) >= 0)
          });
        }).getText().then(function(t) {

          // None of the strings should be empty
          expect(sessionName.length).not.toEqual(0);
          expect(t.length).not.toEqual(0);

          // The calendar one should contain the course-details page one
          expect(sessionName).toMatch(new RegExp(t));
        });
      });
    });
  });


  it('should log out', () => {

    // Check browser url (dashboard)
    expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/1/);

    // Get and click the drop down button in the navbar
    var arrowBtn = browser.driver.findElement(by.css('#arrow-drop-down'));
    page.waitForAnimation();
    arrowBtn.click();
    page.waitForAnimation();

    // Get the text of the last of the opened session's shortcuts inside the calendar view
    var logoutButton = browser.driver.findElement(by.css('#logout-button'));
    logoutButton.click().then(function() {

      // Check browser url (root)
      expect(browser.driver.getCurrentUrl()).toMatch('/');

      //Check if the Welcome button exists
      expect(browser.driver.findElement(by.css('#download-button')).getText()).toEqual('WELCOME!');
    });
  });


});
