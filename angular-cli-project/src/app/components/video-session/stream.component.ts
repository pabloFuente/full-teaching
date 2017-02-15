import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Stream, Session } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'stream',
  styleUrls: ['./stream.component.css'],
  template: `
        <div class='participant' [class.participant-small]="this.small">
          <div *ngIf="this.stream" class="name-div"><p class="name-p">{{stream.getParticipant().getId()}}</p></div>
          <video autoplay="true" [src]="videoSrc"></video>
        </div>`
})
export class StreamComponent {

  @Input()
  stream: Stream;

  @Input()
  small: boolean;

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
