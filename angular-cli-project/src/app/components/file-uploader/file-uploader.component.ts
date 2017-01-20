import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { environment } from '../../../environments/environment';

import { FileUploader }      from 'ng2-file-upload';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  public uploader:FileUploader;
  public hasBaseDropZoneOver:boolean = false;

  @Input()
  private URLUPLOAD: string;
  @Input()
  private typeOfFile: string;
  @Input()
  private buttonText: string;

  @Output() onCompleteFileUpload = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.uploader = new FileUploader({url: this.URLUPLOAD});
    this.uploader.onCompleteItem = (item:any, response:string, status:number, headers:any)=> {
      console.log("File uploaded...");
      this.onCompleteFileUpload.emit(response);
      this.uploader.clearQueue();
    }
  }

  ngOnChanges() {
    this.uploader = new FileUploader({url: this.URLUPLOAD});
    this.uploader.onCompleteItem = (item:any, response:string, status:number, headers:any)=> {
      console.log("File uploaded...");
      this.onCompleteFileUpload.emit(response);
      this.uploader.clearQueue();
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

}
