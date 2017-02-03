import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params}  from '@angular/router';
import { Location }               from '@angular/common';
import { OpenVidu, Session, Stream } from 'openvidu-browser';

import { environment } from '../../../environments/environment';

import { User }                  from '../../classes/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-video-session',
  templateUrl: './video-session.component.html',
  styleUrls: ['./video-session.component.css']
})
export class VideoSessionComponent implements OnInit {

  user: User;
  websocket: WebSocket;
  mySessionId: number;

  myMessage: string;
  fullscreenIcon: string = "fullscreen";

  private openVidu: OpenVidu;

  //Join form
  sessionId: string;
  participantId: string;

  //Session
  currentSession: Session;
  streams: Stream[] = [];

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, private location: Location) {
    this.user = this.authenticationService.getCurrentUser();

    //Getting the session id from the url
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.mySessionId = id;
    });

    //Stablishing OpenVidu session
    this.generateParticipantInfo();
    window.onbeforeunload = () => {
      this.openVidu.close(true);
    }
  }

  ngOnInit() {
    this.joinSession();

    let wsUri = "ws://" + document.location.host + "/chat";
    this.websocket = new WebSocket(wsUri);
    let thisAux = this;

    this.websocket.onopen = function(event: Event) { // connection is open
      $('#message_box').append("<div class='system_msg'>Connected!</div>"); //notify user
      //prepare json data
      let msg = {
        chat: 'Chat-Session-' + thisAux.mySessionId,
        user: thisAux.user.nickName
      };
      //convert and send data to server
      thisAux.websocket.send(JSON.stringify(msg));
    }

    this.websocket.onmessage = function(ev) {
      var msg = JSON.parse(ev.data); //PHP sends Json data
      var type = msg.type; //message type
      var umsg = msg.message; //message text
      var uname = msg.name; //user name
      var ucolor = msg.color; //color

      if (type == 'system') {
        $('#message_box').append(
          "<div class='system_msg'>" + umsg + "</div>");
      } else {
        $('#message_box').append(
          "<div><span class='user_name' style='color:#" + ucolor + "'>"
          + uname
          + "</span> : <span class='user_message'>"
          + umsg
          + "</span></div>");
      }
    };

    this.websocket.onerror = function(ev) {
      $('#message_box').append("<div class='system_error'>Error Occurred - " + ev.message + "</div>");
    };

    this.websocket.onclose = function(ev) {
      $('#message_box').append("<div class='system_msg'>Connection Closed</div>");
    };

    // Deletes the draggable element for the side menu (external to the menu itself in the DOM), avoiding memory leak
    $("div.drag-target").remove();
  }

  ngOnDestroy() {
    // Close the Chat websocket
    this.websocket.close();
    // Close the OpenVidu sesion
    this.leaveSession();
    // Delete the dark overlay (if side menu opened) when the component is destroyed
    $("#sidenav-overlay").remove();
  }

  sendMessage(){
    // Prepare JSON data
    let msg = {
      message: this.myMessage,
      user: this.user.nickName
    };
    // Convert and send data to server
    this.websocket.send(JSON.stringify(msg));
    this.myMessage = "";
  }

  exitFromSession(){
    this.leaveSession();
    this.location.back();
  }

  toggleFullScreen(){
    console.log("FULLSCREEN click");
    let fs = $('#video-session-div').get(0);
    var document:any = window.document;
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
          console.log("enter FULLSCREEN!");
          this.fullscreenIcon = 'fullscreen_exit';
        if (fs.requestFullscreen) {
            fs.requestFullscreen();
        } else if (fs.msRequestFullscreen) {
            fs.msRequestFullscreen();
        } else if (fs.mozRequestFullScreen) {
            fs.mozRequestFullScreen();
        } else if (fs.webkitRequestFullscreen) {
            fs.webkitRequestFullscreen();
        }
    } else {
      console.log("exit FULLSCREEN!");
      this.fullscreenIcon = 'fullscreen';
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
  }


  /* OpenVidu */

  private generateParticipantInfo() {
    this.sessionId = "Session-" + this.mySessionId;
    this.participantId = this.user.nickName;
  }

  private addVideoTag(stream: Stream) {
    console.log("Stream added");
    this.streams.push(stream);
  }

  private removeVideoTag(stream: Stream) {
    console.log("Stream removed");
    this.streams.slice(this.streams.indexOf(stream), 1);
  }

  joinSession() {

    this.openVidu = new OpenVidu(environment.OPENVIDU_URL);

    this.openVidu.connect((error, openVidu) => {

      if (error) {console.log("Connect error"); return console.log(error);}

      let camera = openVidu.getCamera();
      camera.requestCameraAccess((error, camera) => {
        if (error) return console.log(error);
        var sessionOptions = {
          sessionId: this.sessionId,
          participantId: this.participantId
        }

        openVidu.joinSession(sessionOptions, (error, currentSession) => {

          if (error) return console.log(error);

          this.currentSession = currentSession;
          this.addVideoTag(camera);
          camera.publish();

          currentSession.addEventListener("stream-added", streamEvent => {
            this.addVideoTag(streamEvent.stream);
          });

          currentSession.addEventListener("stream-removed", streamEvent => {
            this.removeVideoTag(streamEvent.stream);
          });
        });
      });
    });
  }

  reconnect(){
    console.log("RECONNECTING!!");
    this.joinSession();
  }

  leaveSession() {
    this.currentSession = null;
    this.streams = [];
    if (this.openVidu) this.openVidu.close(true);
    this.generateParticipantInfo();
  }

  /* OpenVidu */

}
