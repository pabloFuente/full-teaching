import { Component, OnInit, Input, trigger, state, animate, transition, style } from '@angular/core';

import { LessonDetails } from '../../classes/lesson-details';

import { Entry } from '../../classes/entry';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css'],
  animations: [
    trigger('fadeAnim', [
      state('commentsShown', style({
        opacity: 1
      })),
      state('commentsHidden', style({
        opacity: 0.2
      })),
      transition('commentsHidden => commentsShown', animate('.4s')),
    ]),
  ]
})
export class LessonDetailsComponent implements OnInit {

  @Input()
  lessonDetails: LessonDetails;

  selectedEntry: Entry;

  fadeAnim = 'commentsShown';

  constructor() { }

  ngOnInit() {
    this.selectedEntry = this.lessonDetails.forum.entries[0];
  }

}
