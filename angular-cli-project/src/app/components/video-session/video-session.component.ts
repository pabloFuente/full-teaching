import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params}  from '@angular/router';
import { Location }               from '@angular/common';
import { OpenVidu, Session, Stream } from 'openvidu-browser';

import { environment } from '../../../environments/environment';

import { User }     from '../../classes/user';
import { Course }   from '../../classes/course';
import { Chatline } from '../../classes/chatline';
import { Session as MySession }  from '../../classes/session';

import { AuthenticationService } from '../../services/authentication.service';
import { VideoSessionService }   from '../../services/video-session.service';

@Component({
  selector: 'app-video-session',
  templateUrl: './video-session.component.html',
  styleUrls: ['./video-session.component.css']
})
export class VideoSessionComponent implements OnInit {

  user: User;
  mySession: MySession;
  course: Course;
  usersConnected = [];
  usersIntervention = [];
  websocket: WebSocket;
  mySessionId: number;

  showChat: boolean = true;
  showChatIcon: string = 'supervisor_account';
  chatLines: Chatline[] = [];

  myMessage: string;
  fullscreenIcon: string = "fullscreen";
  playPauseIcon: string = "pause";
  volumeMuteIcon: string = "volume_up";
  volumeLevel: number;
  storedVolumeLevel: number;

  controlsShown: boolean;

  interventionRequired: boolean = false;
  interventionIcon: string = 'record_voice_over';

  private openVidu: OpenVidu;

  // Join form
  sessionId: string;
  participantId: string;

  // Session
  currentSession: Session;
  streams: Stream[] = [];

  constructor(private authenticationService: AuthenticationService,
              private videoSessionService: VideoSessionService,
              private route: ActivatedRoute,
              private location: Location)
  {
    this.user = this.authenticationService.getCurrentUser();
    this.mySession = this.videoSessionService.session;
    this.course = this.videoSessionService.course;

    // Getting the session id from the url
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.mySessionId = id;
    });

    // Stablishing OpenVidu session
    this.generateParticipantInfo();
    window.onbeforeunload = () => {
      this.openVidu.close(true);
    }
  }

  ngOnInit() {
    this.joinSession();

    let wsUri = environment.CHAT_URL;
    this.websocket = new WebSocket(wsUri);
    let thisAux = this;

    this.websocket.onopen = function(event: Event) { // Connection is open
      // New welcome chat line
      thisAux.chatLines.push(new Chatline('system-msg', null, "Connected!", null)); // Notify user

      // Prepare json data
      let msg = {
        chat: 'Chat-Session-' + thisAux.mySessionId,
        user: thisAux.user.nickName,
        teacher: thisAux.course.teacher.nickName
      };
      // Convert and send data to server
      thisAux.websocket.send(JSON.stringify(msg));
    }

    this.websocket.onmessage = function(ev) {
      var msg = JSON.parse(ev.data); // PHP sends Json data
      var type = msg.type; // Message type
      var umsg = msg.message; // Message text
      var uname = msg.name; // User name
      var ucolor = msg.color; // Color

      if (type == 'system') {
        // New system chat line
        thisAux.chatLines.push(new Chatline('system-msg', null, umsg, null));
      } else if (type == 'system-users') {
        // Users connected message received
        let jsonObject = JSON.parse(umsg);
        console.log("USERS CONNECTED:");
        console.log(jsonObject);
        thisAux.usersConnected  = [];
        if (jsonObject.hasOwnProperty('UserNameList')){
          let objectY: any;
          for (var j = 0; j < jsonObject.UserNameList.length; j++){
            objectY = jsonObject.UserNameList[j];
            console.log(objectY);
            thisAux.usersConnected.push(objectY);
          }
        }
      } else if ((type == 'system-intervention') && (thisAux.authenticationService.isTeacher())){
        // User's petition for intervention received
        let jsonObject = JSON.parse(umsg);
        console.log("USER PETITION:");
        console.log(jsonObject);
        if (jsonObject.hasOwnProperty('petition')){
          if (jsonObject.petition) {
            // Add new user's petition
            thisAux.usersIntervention.push(jsonObject);
          }
          else {
            // Remove user's petition
            let index = thisAux.usersIntervention.map(function(u) { return u.user; }).indexOf(jsonObject.user);
            if (index !== -1) {
              thisAux.usersIntervention.splice(index, 1);
            }
          }
        }
      }
      else {
        let classUserMsg = (uname === thisAux.user.nickName ? "own-msg" : "stranger-msg");
        // New user chat line
        thisAux.chatLines.push(new Chatline(classUserMsg, uname, umsg, ucolor));
      }
    };

    this.websocket.onerror = function(ev) {
      // New system error chat line
      thisAux.chatLines.push(new Chatline('system-err', null, 'Error Occurred - ' + ev.message, null));
    };

    this.websocket.onclose = function(ev) {
      // New system close chat line
      thisAux.chatLines.push(new Chatline('system-msg', null, 'Connection Closed', null));
    };

    // Deletes the draggable element for the side menu (external to the menu itself in the DOM), avoiding memory leak
    $("div.drag-target").remove();
    this.volumeLevel = 1;
  }

  ngOnDestroy() {
    // Close the Chat websocket
    this.websocket.close();
    // Close the OpenVidu sesion
    this.leaveSession();
    // Delete the dark overlay (if side menu opened) when the component is destroyed
    $("#sidenav-overlay").remove();
  }

  sendMessage() {
    // Prepare JSON data
    let msg = {
      message: this.myMessage,
      user: this.user.nickName
    };
    // Convert and send data to server
    this.websocket.send(JSON.stringify(msg));
    this.myMessage = "";
  }

  exitFromSession() {
    this.leaveSession();
    this.location.back();
  }

  changeShowChat(){
    this.showChat = !this.showChat;
    this.showChatIcon = (this.showChat ? 'supervisor_account' : 'chat');
    console.log(this.streams);
  }

  askForIntervention() {
    // Prepare json data
    let msg = {
      chatIntervention: 'Chat-Session-' + this.mySessionId,
      petition: !this.interventionRequired,
      user: this.user.nickName
    };
    // Convert and send petition to server
    this.websocket.send(JSON.stringify(msg));
    // Invert intervention request
    this.interventionRequired = !this.interventionRequired;
    // Change intervention icon
    this.interventionIcon = (this.interventionRequired ? 'cancel' : 'record_voice_over');
  }


  /* Video controls */

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

  togglePlayPause(){
    let video = $('video')[0];
    if(video){
      if (video.paused) {
        this.playPauseIcon = 'pause';
        video.play();
      }
      else {
        this.playPauseIcon = 'play_arrow';
        video.pause();
      }
    }
  }

  toggleMute(){
    console.log(this.volumeLevel);
    let video = $('video')[0];
    if(video){
      if (video.volume == 0.0) {
        video.volume = this.storedVolumeLevel;
        this.volumeLevel = this.storedVolumeLevel;
        this.changeVolumeIcon(video);
      }
      else {
        this.storedVolumeLevel = video.volume;
        video.volume = 0.0;
        this.volumeLevel = 0.0;
        this.changeVolumeIcon(video);
      }
    }
  }

  changeVolume(event){
    let video = $('video')[0];
    console.log(this.volumeLevel);
    video.volume = this.volumeLevel;
    this.changeVolumeIcon(video);
  }

  changeVolumeIcon(video){
    if (video.volume > 0.65) this.volumeMuteIcon = "volume_up";
    else if (video.volume == 0.0) this.volumeMuteIcon = "volume_off";
    else this.volumeMuteIcon = "volume_down";
  }

  /* Video controls */


  /* OpenVidu */

  private generateParticipantInfo() {
    this.sessionId = this.mySession.title;
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

      if (this.authenticationService.isTeacher()) {
        let camera = openVidu.getCamera();
        camera.requestCameraAccess((error, camera) => {
          if (error) return console.log(error);
          this.joinSessionShared(this.openVidu, camera);
        });
      }
      else {
        this.joinSessionShared(this.openVidu, null);
      }
    });
  }

  joinSessionShared(openVidu: OpenVidu, camera: Stream){
    var sessionOptions = {
      sessionId: this.sessionId,
      participantId: this.participantId
    }
    openVidu.joinSession(sessionOptions, (error, currentSession) => {

      if (error) return console.log(error);

      this.currentSession = currentSession;

      if (this.authenticationService.isTeacher()) {
        this.addVideoTag(camera);
        this.publishCamera(camera);
      }
      /*else{
        this.publishCamera(camera);
      }*/

      currentSession.addEventListener("stream-added", streamEvent => {
        this.addVideoTag(streamEvent.stream);
      });

      currentSession.addEventListener("stream-removed", streamEvent => {
        this.removeVideoTag(streamEvent.stream);
      });
    });
  }

  publishCamera(camera: Stream){
    camera.publish();
  }

  leaveSession() {
    this.currentSession = null;
    this.streams = [];
    if (this.openVidu) this.openVidu.close(true);
    this.generateParticipantInfo();
  }

  /* OpenVidu */

}
