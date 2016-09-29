/*import {
  inject,
  async,
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Observable }               from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { NavbarComponent } from '../navbar/navbar.component';

class MockAuthenticationService extends AuthenticationService {

  login(email, pass) {
    return Observable.of(true);
  }

}

describe('navbar component', () => {
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
      declarations: [NavbarComponent],
      providers: [{ provide: AuthenticationService, useClass: MockAuthenticationService }]
    });
  });

  describe('without overriding', () => {
    beforeEach(async(() => {
      TestBed.compileComponents();
    }));

    it('should have Sign in and Log in buttons', async(() => {
      var fixture = TestBed.createComponent(NavbarComponent);
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;

      expect(compiled).toContainText('Sign in');
      expect(compiled).toContainText('Log in');
      //expect(compiled.querySelector('h3')).toHaveText('Status: Enter PIN');
    }));

    it('should open login modal', async(() => {
      var fixture = TestBed.createComponent(NavbarComponent);
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('#signInButton').click();

      fixture.debugElement.componentInstance.pending.then(() => {
        fixture.detectChanges();
        expect(compiled.querySelector('.modal')).toHaveText('Welcome');
      });
    }));

    it('should accept pin (with whenStable)', async(() => {
      var fixture = TestBed.createComponent(GreetingComponent);
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('button').click();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(compiled.querySelector('h3')).toHaveText('Status: Welcome!');
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
