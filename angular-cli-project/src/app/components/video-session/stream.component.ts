import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, SimpleChange } from '@angular/core';
import { Stream, Session } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'stream',
  styleUrls: ['./stream.component.css'],
  template: `
        <div class='participant' [class.participant-small]="this.small">
          <div *ngIf="this.stream" class="name-div"><p class="name-p">{{this.getName()}}</p></div>
          <video #videoElement autoplay="true" [muted]="this.muted"></video>
        </div>`
})
export class StreamComponent {

  @ViewChild('videoElement') elementRef: ElementRef;
  videoElement: HTMLVideoElement;

  @Input()
  stream: Stream;

  @Input()
  small: boolean;

  @Input()
  muted: boolean;

  constructor() { }

  ngAfterViewInit() { // Get HTMLVideoElement from the view
    this.videoElement = this.elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) { // Listen to 'muted' property changes
    if (changes['muted']) {
      this.muted = changes['muted'].currentValue;
      console.warn("Small: " + this.small + " | Muted: " + this.muted);
    }
  }

  ngDoCheck() { // Detect any change in 'stream' property (specifically in its 'srcObject' property)
    if (this.videoElement && this.stream && (this.videoElement.srcObject !== this.stream.getMediaStream())) {
      this.videoElement.srcObject = this.stream.getMediaStream();
      console.warn("Stream updated");
    }
  }

  getName() {
    return ((JSON.parse(this.stream.connection.data))['name']);
  }

}
