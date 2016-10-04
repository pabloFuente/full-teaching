import { Component, OnInit, Input } from '@angular/core';

import { LessonDetails } from '../lesson-details';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css']
})
export class LessonDetailsComponent implements OnInit {

  @Input()
  lessonDetails: LessonDetails;

  constructor() { }

  ngOnInit() {
  }

}
