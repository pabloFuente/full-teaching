import { Component, OnInit, Input } from '@angular/core';

import { FileGroup } from '../../classes/file-group';

@Component({
  selector: 'app-file-group',
  templateUrl: './file-group.component.html',
  styleUrls: ['./file-group.component.css']
})
export class FileGroupComponent implements OnInit {

  @Input()
  public fileGroup: FileGroup;

  @Input()
  public depth: number;

  typeOfFile = ['language', 'picture_as_pdf', 'videocam'];

  constructor() {

  }

  ngOnInit() {

  }


}
