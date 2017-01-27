import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../../environments/environment';

import { FileUploader }      from 'ng2-file-upload';

import { UploaderModalService }   from '../../services/uploader-modal.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  public uploader:FileUploader;
  public hasBaseDropZoneOver:boolean = false;

  subscription: Subscription;

  @Input()
  private isMultiple: boolean;
  @Input()
  private URLUPLOAD: string = "/test";
  @Input()
  private typeOfFile: string;
  @Input()
  private buttonText: string;

  @Output()
  onCompleteFileUpload = new EventEmitter<any>();
  @Output()
  onUploadStarted = new EventEmitter<boolean>();

  constructor(private uploaderModalService: UploaderModalService) {

    //Subscription for clearing the queue
    this.subscription = this.uploaderModalService.uploaderClosedAnnounced$.subscribe(
      objs => {this.uploader.clearQueue();}
    );

  }

  ngOnInit() {
    this.uploader = new FileUploader({url: this.URLUPLOAD});
    this.uploader.onCompleteItem = (item:any, response:string, status:number, headers:any)=> {
      console.log("File uploaded...");
      this.onCompleteFileUpload.emit(response);
    }
  }

  ngOnChanges() {
    if(this.uploader){
      this.uploader.destroy();
      this.uploader = new FileUploader({url: this.URLUPLOAD});
      this.uploader.onCompleteItem = (item:any, response:string, status:number, headers:any)=> {
        console.log("File uploaded...");
        this.onCompleteFileUpload.emit(response);

      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.uploader){
      this.uploader.destroy();
      this.uploader.clearQueue();
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

}
