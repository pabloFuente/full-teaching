import { Component, OnInit, OnChanges, Input, trigger, state, animate, transition, style } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import { CommentComponent } from '../comment/comment.component';

import { ForumModalDataService } from '../../services/forum-modal-data.service';
import { CourseService }            from '../../services/course.service';
import { AuthenticationService }    from '../../services/authentication.service';

import { CourseDetails } from '../../classes/course-details';
import { Entry } from '../../classes/entry';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
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
export class CourseDetailsComponent implements OnInit {

  courseDetails: CourseDetails;

  selectedEntry: Entry;

  fadeAnim = 'commentsShown';

  constructor(
    private courseService: CourseService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private forumModalDataService: ForumModalDataService) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.courseService.getCourseDetails(id).subscribe(
        courseDetails => {
          console.log(courseDetails);
          this.courseDetails = courseDetails;
          this.selectedEntry = this.courseDetails.forum.entries[0];
        },
        error => console.log(error));
    });

  }

  updateForumModalMode(mode: number, header: string, commentReplay: string) {
    let objs = [mode, header, commentReplay];
    this.forumModalDataService.announceMode(objs);
  }
}
