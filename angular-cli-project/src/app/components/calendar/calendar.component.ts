import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService }   from '../../services/session.service';
import { Session } from '../../classes/session';
import {
  startOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction
} from 'angular2-calendar'; // import should be from `angular2-calendar` in your app

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

class MyCalendarEvent implements CalendarEvent {
  start: Date;
  title: string;
  color = colors.red;
  actions: CalendarEventAction[];
  session: Session;
}

@Component({
  selector: 'calendar-app',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {

  view: string = 'month';

  viewDate: Date = new Date();

  events: MyCalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    this.getAllSessions();
  }

  increment(): void {
    const addFn: any = {
      day: addDays,
      week: addWeeks,
      month: addMonths
    }[this.view];
    this.viewDate = addFn(this.viewDate, 1);
    this.activeDayIsOpen = false;
  }

  decrement(): void {
    const subFn: any = {
      day: subDays,
      week: subWeeks,
      month: subMonths
    }[this.view];
    this.viewDate = subFn(this.viewDate, 1);
    this.activeDayIsOpen = false;
  }

  today(): void {
    this.viewDate = new Date();
    this.activeDayIsOpen = true;
  }

  dayClicked({date, events}: { date: Date, events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  getAllSessions() {
    this.sessionService.getAllSessions().subscribe(
      sessions => {
        console.log(sessions);
        for (let s of sessions) {
          let min = s.date.getMinutes();
          if (min < 10) { min = "0" + min; }
          this.events.push({
            start: s.date,
            title: s.title + '  |  ' + s.date.getHours() + ':' + min,
            color: colors.red,
            actions: [
              {
                label: '<i class="material-icons calendar-event-icon">forward</i>',
                onClick: ({event}: { event: CalendarEvent }): void => {
                  this.router.navigateByUrl('/courses/' + s.courseID);
                }
              }],
              session: s,
          });
        }
      },
      error => console.log(error)
    );
  }

}
