import { browser, element, by, protractor } from 'protractor/globals';

import { AngularCliProjectPage } from './app.po';

describe('angular-cli-project App', function() {

  let page: AngularCliProjectPage;
  let userEmail: string = "teacher@gmail.com";
  let userPass: string = "pass";
  let chatMessage: string = "This is a testing message for the chat";

  browser.driver.manage().window().maximize();

  beforeEach(() => {
    page = new AngularCliProjectPage();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
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
    browser.driver.findElement(by.id('download-button')).then(function(welcomeBtn) {
      welcomeBtn.click().then(function() {

        // Find form elements
        var userNameField = browser.driver.findElement(by.id('email'));
        var userPassField = browser.driver.findElement(by.id('password'));

        // Fill input fields
        userNameField.sendKeys('wrongemail@gmail.com');
        userPassField.sendKeys('pass');

        // Ensure fields contain what has been entered
        expect(userNameField.getAttribute('value')).toEqual('wrongemail@gmail.com');
        expect(userPassField.getAttribute('value')).toEqual('pass');

        browser.driver.findElement(by.id('log-in-btn')).then(function(loginBtn) {
          // Click to log in - waiting for Angular as it is manually bootstrapped.
          loginBtn.click().then(function() {
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
      });
    });
  });


  it('should log in', () => {

    // Check browser url (root)
    expect(browser.driver.getCurrentUrl()).toMatch('/');

    // Find form elements (login modal is already opened)
    var userNameField = browser.driver.findElement(by.id('email'));
    var userPassField = browser.driver.findElement(by.id('password'));

    // Fill input fields
    userNameField.sendKeys(userEmail);
    userPassField.sendKeys(userPass);

    // Ensure fields contain what has been entered
    expect(userNameField.getAttribute('value')).toEqual(userEmail);
    expect(userPassField.getAttribute('value')).toEqual(userPass);

    browser.driver.findElement(by.id('log-in-btn')).then(function(loginBtn) {
      // Click to log in - waiting for Angular as it is manually bootstrapped.
      loginBtn.click().then(function() {
        browser.waitForAngular();

        // Browser url must have changed to the dashboard route
        expect(browser.driver.getCurrentUrl()).toMatch('/courses');
      });
    });
  });


  it('should allow adding new courses', () => {

    // Check browser url (dashboard)
    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    page.waitUntilElementPresent('#add-course-icon');

    // Open modal for adding a course
    browser.driver.findElement(by.css('#add-course-icon')).then(function(addCourseIcon) {

      addCourseIcon.click();
      page.waitSeconds(1);

      // Find form elements
      browser.driver.findElement(by.id('inputPostCourseName')).then(function(courseNameField) {
        // Fill input fields
        courseNameField.sendKeys('New testing course').then(function() {
          // Ensure fields contain what has been entered
          expect(courseNameField.getAttribute('value')).toEqual('New testing course');

          browser.driver.findElement(by.id('submit-post-course-btn')).then(function(submitNewCourseBtn) {
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
        });
      });
    });
  });


  it('should allow editing courses', () => {

    // Check browser url (dashboard)
    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    // Get and click the button to edit the last one of the courses
    var lastEditCoursesIcon = element.all(by.className('course-put-icon')).last();
    page.waitUntilElementNotVisible('#course-modal');
    lastEditCoursesIcon.click();
    page.waitUntilElementPresent('#put-delete-course-modal');

    // Get field inputs
    var courseNameField = browser.driver.findElement(by.id('inputPutCourseName'));

    // Fill input field
    courseNameField.clear();
    courseNameField.sendKeys('[EDITED]');

    // Ensure field contains what has been entered
    expect(courseNameField.getAttribute('value')).toEqual('[EDITED]');

    browser.driver.findElement(by.id('submit-put-course-btn')).then(function(submitEditCourseBtn) {
      // Click submit form
      submitEditCourseBtn.click().then(function() {
        browser.waitForAngular();

        //The last course should have changed its name
        var editedCourse = element.all(by.className('course-title')).last();
        expect(editedCourse.getText()).toEqual('[EDITED]');
      });
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
    page.waitUntilElementNotVisible('#put-delete-course-modal');
    lastEditCoursesIcon.click();
    page.waitForAnimation();

    // Get and click the checkbox to allow the course's deletion
    browser.driver.findElement(by.css('label[for=delete-checkbox]')).then(function(deletionAllow) {
      deletionAllow.click();

      // Get and click the button to delete the course
      browser.driver.findElement(by.css('div.delete-div a.btn-flat')).then(function(deleteButton) {
        deleteButton.click().then(function() {
          browser.waitForAngular();

          // Get the number of courses present in the dashboard
          var courses2 = element.all(by.className('course-title'));
          var j = courses2.count;

          // Should be exactly one course less than before the deletion
          expect(Number(j.toString()) === (Number(i.toString()) - 1));
        });
      });
    });
  });


  it('should allow navigation to sessions directly from calendar', () => {

    // Check browser url (dashboard)
    expect(browser.driver.getCurrentUrl()).toMatch('/courses');

    // Get and click the last one of the indicators of session inside the calendar view
    var lastSessionIndicatorOfMonth = element.all(by.css('.cal-in-month.cal-has-events .cal-day-badge')).last();
    page.waitUntilElementNotVisible('#put-delete-course-modal');
    lastSessionIndicatorOfMonth.click().then(function() {

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
  });

  it('should have all the tabs properly working', () => {

    // Check browser url (course-details)
    expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/[0-4]/);

    // Get all tab bodies
    var tabBodies = element.all(by.css('.md-tab-body-wrapper .md-tab-body'));
    expect(tabBodies.count()).toEqual(5);
    // Get all tab buttos
    var tabButtons = element.all(by.css('.md-tab-label-aux'));
    expect(tabButtons.count()).toEqual(5);

    // For each tab: check the url, check if the active tab-body is the expected and
    // check if the proper *ngIf has been activated ('div.tab-template-content' should be present)
    tabButtons.get(0).click().then(function() {
      expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/0/);
      expect(tabBodies.get(0).getAttribute('class')).toContain('md-tab-active');
      expect(element(by.css('.md-tab-active div.tab-template-content')).isPresent()).toBe(true);

      tabButtons.get(1).click().then(function() {
        expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/1/);
        expect(tabBodies.get(1).getAttribute('class')).toContain('md-tab-active');
        expect(element(by.css('.md-tab-active div.tab-template-content')).isPresent()).toBe(true);

        tabButtons.get(2).click().then(function() {
          expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/2/);
          expect(tabBodies.get(2).getAttribute('class')).toContain('md-tab-active');
          expect(element(by.css('.md-tab-active div.tab-template-content')).isPresent()).toBe(true);

          tabButtons.get(3).click().then(function() {
            expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/3/);
            expect(tabBodies.get(3).getAttribute('class')).toContain('md-tab-active');
            expect(element(by.css('.md-tab-active div.tab-template-content')).isPresent()).toBe(true);

            tabButtons.get(4).click().then(function() {
              expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/4/);
              expect(tabBodies.get(4).getAttribute('class')).toContain('md-tab-active');
              expect(element(by.css('.md-tab-active div.tab-template-content')).isPresent()).toBe(true);

              // Back to sessions tab
              tabButtons.get(1).click();
            });
          });
        });
      });
    });
  });


  it('should navigate to video-session page and chat should work', () => {
    // Check browser url (course-details, tab 1)
    expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/1/);

    //Get and click on a ready session
    browser.driver.findElement(by.css('.session-ready')).then(function(sessionReady) {
      sessionReady.click().then(function() {
        browser.ignoreSynchronization = true;
        //browser.waitForAngular();
        //page.waitSeconds(2);

        // Check browser url (course-details, tab 1)
        expect(browser.driver.getCurrentUrl()).toMatch(/\/session\/[0-9]+/);

        element(by.css('#fixed-icon')).click().then(function() {
          browser.driver.findElement(by.css('input#message')).then(function(inputChat) {
            // Fill input field
            inputChat.sendKeys(chatMessage).then(function() {
              // Ensure field contain what has been entered
              expect(inputChat.getAttribute('value')).toEqual(chatMessage);
              page.waitUntilElementPresent('div.system-msg');
              browser.driver.findElement(by.css('input#send-btn')).then(function(sendBtn) {
                sendBtn.click().then(function() {
                  page.waitUntilElementPresent("div.own-msg span.user-message");
                  element.all(by.css(".user-message")).getText().then(function(userMessages) {
                    expect(userMessages.indexOf(chatMessage) >= 0).toBe(true);

                    element(by.css('#exit-icon')).click().then(function() {
                      browser.waitForAngular();
                      page.waitForAnimation();
                      expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/1/);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });


  it('should allow adding new entries to the forum', () => {
    expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/1/);

    // Get all tab buttos
    browser.driver.findElements(by.css('.md-tab-label-aux')).then(function(tabButtons) {

      expect(tabButtons.length === 5).toBeTruthy();

      tabButtons[2].click().then(function() {
        expect(browser.driver.getCurrentUrl()).toMatch(/\/courses\/[0-9]+\/2/);
        element(by.css('.card-panel.warning')).isPresent().then(function(pres) {
          if (pres) {
            element(by.css('#edit-forum-icon')).click().then(function() {
              page.waitForAnimation();
              // Get and click the checkbox to allow the forum's activation
              browser.driver.findElement(by.css('label[for=delete-checkbox]')).then(function(activationAllowed) {
                activationAllowed.click();

                // Get and click the button to activate the forum
                browser.driver.findElement(by.css('#put-modal-btn')).then(function(activateButton) {
                  activateButton.click().then(function() {
                    browser.waitForAngular();
                    page.waitForAnimation();
                    page.waitUntilElementPresent('#add-entry-icon');
                  });
                });
              });
            });
          }
          browser.driver.findElement(by.css('#add-entry-icon')).then(function(btn) {
            btn.click().then(function() {
              page.waitUntilElementPresent('#course-details-modal');

              // Find form elements
              var entryTitleField = browser.driver.findElement(by.css('input#inputTitle'));
              var entryCommentField = browser.driver.findElement(by.css('textarea#inputComment'));
              // Fill input fields
              entryTitleField.sendKeys('New testing entry title');
              entryCommentField.sendKeys('New testing entry comment');
              // Ensure fields contain what has been entered
              expect(entryTitleField.getAttribute('value')).toEqual('New testing entry title');
              expect(entryCommentField.getAttribute('value')).toEqual('New testing entry comment');

              // Send new entry
              browser.driver.findElement(by.css('#post-modal-btn')).then(function(sendButton) {
                sendButton.click().then(function() {
                  browser.waitForAngular();
                  page.waitUntilElementNotVisible('#course-details-modal');

                  // Get and check the title of last entry
                  var entries = element.all(by.css('li.entry-title div div a'));
                  expect(entries.last().getText()).toContain('New testing entry title');

                });
              });
            });
          });
        });
      });
    });
  });


  it('should be possible to navigate to settings page', () => {
    // Navigate to Settings page
    browser.driver.findElement(by.css('#settings-button')).then(function(settingsButton) {
      settingsButton.click().then(function() {
        browser.waitForAngular();

        // Browser url must have changed (/settings)
        expect(browser.driver.getCurrentUrl()).toMatch('/settings');
        // Settings page should display the user email
        browser.driver.findElement(by.css('div#stng-user-mail')).then(function(divMail) {
          expect(divMail.getText()).toEqual(userEmail);
        });
      });
    });
  });


  it('should log out', () => {

    // Get and click the drop down button in the navbar
    var arrowBtn = browser.driver.findElement(by.css('#arrow-drop-down')).then(function(arrow) {
      arrow.click();
      page.waitUntilElementVisible('#dropdown1');

      // Get and click the logout button inside the drop-down menu
      var logoutButton = browser.driver.findElement(by.css('#logout-button')).then(function(logoutBtn) {
        logoutBtn.click().then(function() {
          browser.waitForAngular();

          // Check browser url (root)
          expect(browser.driver.getCurrentUrl()).toMatch('/');

          //Check if the Welcome button exists
          expect(browser.driver.findElement(by.css('#download-button')).getText()).toEqual('WELCOME!');
        });
      });
    });
  });


});
