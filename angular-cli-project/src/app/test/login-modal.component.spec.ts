/*import {
  inject,
  async,
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Observable }               from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

class MockAuthenticationService extends AuthenticationService {
  login(email, pass) {
    return Observable.of(true);
  }
}

class RouterStub {
  navigateByUrl(url: string) { return url; }
}

describe('login-modal component', () => {
  beforeEach(() => {

    //We add to jasmine the following methods
    jasmine.addMatchers({
      toHaveText: function() {
        return {
          compare: function(actual, expectedText) {
            var actualText = actual.textContent;
            return {
              pass: actualText == expectedText,
              get message() { return 'Expected ' + actualText + ' to equal ' + expectedText; }
            };
          }
        };
      },
      toContainText: function() {
        return {
          compare: function(actual, expectedText) {
            var actualText = actual.textContent;
            return {
              pass: actualText.indexOf(expectedText) > -1,
              get message() { return 'Expected ' + actualText + ' to contain ' + expectedText; }
            };
          }
        };
      }
    });


    TestBed.configureTestingModule({
      declarations: [ LoginModalComponent ],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: Router, useClass: RouterStub },
      ],
    });
  });

  describe('without overriding', () => {
    beforeEach(async(() => {
      TestBed.compileComponents();
    }));

    it('should have Welcome Title', async(() => {
      var fixture = TestBed.createComponent(LoginModalComponent);
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;

      expect(compiled).toContainText('Welcome to FullTeaching !');
    }));

    it('should have Sign up button to change the modal view', async(() => {
      var fixture = TestBed.createComponent(LoginModalComponent);
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.modal-footer-button')).toHaveText('Sign up');
    }));

    it('should open Sign up view when Sign up button is pressed', async(() => {
      var fixture = TestBed.createComponent(LoginModalComponent);
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('.modal-footer-button').click();

      fixture.detectChanges();
      expect(compiled.querySelector('.modal-footer')).toContainText('Already registered?');
    }));

    it('should login when Log In service accepts user', inject([Router], async(() => {
      var fixture = TestBed.createComponent(LoginModalComponent);
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;

      var authenticationService = fixture.debugElement.injector.get(AuthenticationService);
      expect(authenticationService.isLoggedIn)
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(compiled.querySelector('div .container .margins-top-bottom')).toContainText('Title');
      });
    }));

    it('should accept pin (with fakeAsync)', fakeAsync(() => {
      var fixture = TestBed.createComponent(GreetingComponent);

      var compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('button').click();

      tick();
      fixture.detectChanges();
      expect(compiled.querySelector('h3')).toHaveText('Status: Welcome!');
    }));
  });

  describe('overriding', () => {
    it('should override the template', async(() => {
      TestBed.overrideComponent(GreetingComponent, {
        set: {
          template: `<span>Foo {{greeting}}<span>`
        }
      }).compileComponents().then(() => {
        var fixture = TestBed.createComponent(GreetingComponent);
        fixture.detectChanges();

        var compiled = fixture.debugElement.nativeElement;
        expect(compiled).toHaveText('Foo Enter PIN');
      });
    }));
  });
});*/
