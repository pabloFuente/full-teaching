import { Component, OnInit, Input } from '@angular/core';

import { LessonDetails } from '../../classes/lesson-details';

import { Entry } from '../../classes/entry';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css']
})
export class LessonDetailsComponent implements OnInit {

  @Input()
  lessonDetails: LessonDetails;

  selectedEntry: Entry;

  sideNavHidden = false;

  constructor() { }

  ngOnInit() {
    this.selectedEntry = this.lessonDetails.forum.entries[0];
  }

}
