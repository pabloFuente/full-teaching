import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../../environments/environment';
import { Constants }   from '../../constants';

import { FileUploader }      from 'ng2-file-upload';

import { UploaderModalService }   from '../../services/uploader-modal.service';

declare var Materialize : any;

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  public uploader:FileUploader;
  public hasBaseDropZoneOver:boolean = false;

  subscription: Subscription;

  fileIncorrect = false;

  @Input()
  private uniqueID: number;
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
      objs => {this.uploader.clearQueue(); this.fileIncorrect = false;}
    );

  }

  ngOnInit() {
    this.uploader = new FileUploader({url: this.URLUPLOAD, maxFileSize: Constants.FILE_SIZE_LIMIT});
    this.uploader.onCompleteItem = (item:any, response:string, status:number, headers:any)=> {
      console.log("File uploaded...");
      this.onCompleteFileUpload.emit(response);
    }
    this.uploader.onWhenAddingFileFailed = (fileItem) => {
      this.handleFileSizeError();
    }
  }

  ngOnChanges() {
    if(this.uploader){
      this.uploader.destroy();
      this.uploader = new FileUploader({url: this.URLUPLOAD, maxFileSize: Constants.FILE_SIZE_LIMIT});
      this.uploader.onCompleteItem = (item:any, response:string, status:number, headers:any)=> {
        console.log("File uploaded...");
        this.onCompleteFileUpload.emit(response);
      }
      this.uploader.onWhenAddingFileFailed = (fileItem) => {
        this.handleFileSizeError();
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

  handleFileSizeError(){
    console.log("File too big. " + this.URLUPLOAD);
    if (window.innerWidth <= Constants.PHONE_MAX_WIDTH) { // On mobile phones error on toast
      Materialize.toast('Files cannot be bigger than 5MB!', Constants.TOAST_SHOW_TIME, 'rounded');
    } else { // On desktop error on error-message
      this.fileIncorrect = true;
    }
  }

}
