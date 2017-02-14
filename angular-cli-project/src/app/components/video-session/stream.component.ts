import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Stream, Session } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'stream',
  styles: [`
        .participant {
          width: 100%;
          margin: 0;
        }
        .participant video {
	        width: 100%;
	        height: auto;
        }
        .name-div {
          position: fixed;
          width: 100%;
          bottom: 0;
          color: white;
          text-align: right;
        }
        .name-p {
          display: inline-block;
          margin-right: 20px;
          background-color: #375646;
          padding: 5px;
          border-radius: 2px;
          font-weight: bold;
        }
        `],
  template: `
        <div class='participant'>
          <div *ngIf="this.stream" class="name-div"><p class="name-p">{{stream.getParticipant().getId()}}</p></div>
          <video autoplay="true" [src]="videoSrc"></video>
        </div>`
})
export class StreamComponent {

  @Input()
  stream: Stream;

  videoSrc: SafeUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {

    let int = setInterval(() => {
      if (this.stream.getWrStream()) {
        this.videoSrc = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(this.stream.getWrStream()));
        console.log("Video tag src=" + this.videoSrc);
        clearInterval(int);
      }
    }, 1000);

    //this.stream.addEventListener('src-added', () => {
    //    this.video.src = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.stream.getWrStream())).toString();
    //});
  }

  ngOnChanges(){
    let int = setInterval(() => {
      if (this.stream.getWrStream()) {
        this.videoSrc = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(this.stream.getWrStream()));
        console.log("Video tag src=" + this.videoSrc);
        clearInterval(int);
      }
    }, 1000);
  }

}
