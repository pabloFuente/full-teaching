import { Component, OnInit, Input, trigger, state, animate, transition, style } from '@angular/core';

import { Entry } from '../../classes/entry';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  animations: [
    trigger('fadeAnim', [
      state('commentsShown', style({
        opacity: 1
      })),
      state('commentsHidden', style({
        opacity: 0.2
      })),
      transition('commentsHidden => commentsShown', animate('.4s')),
      transition('commentsShown => commentsHidden', animate('.1s')),
    ]),
  ]
})
export class ForumComponent implements OnInit {

  @Input()
  entries: Entry[];

  @Input()
  selectedEntry: Entry;

  fadeAnim = 'commentsShown';

  constructor() { }

  ngOnInit() { console.log(this.entries); }

}
