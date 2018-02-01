import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { OpenVidu, Session, Stream, Publisher } from "openvidu-browser";

import { environment } from '../../../environments/environment';

import { User } from '../../classes/user';
import { Course } from '../../classes/course';
import { Chatline } from '../../classes/chatline';
import { Session as MySession } from '../../classes/session';

import { AuthenticationService } from '../../services/authentication.service';
import { VideoSessionService } from '../../services/video-session.service';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-video-session',
  templateUrl: './video-session.component.html',
  styleUrls: ['./video-session.component.css']
})
export class VideoSessionComponent implements OnInit {

  user: User;
  mySession: MySession;
  course: Course;
  teacherName: string;
  usersConnected = [];
  usersIntervention = [];
  websocket: WebSocket;
  mySessionId: number;

  showChat: boolean = true;
  chatLines: Chatline[] = [];
  myMessage: string;

  volumeLevel: number;
  storedVolumeLevel: number;
  controlsShown: boolean;

  interventionRequired: boolean = false;
  studentAccessGranted: boolean = false;
  myStudentAccessGranted: boolean = false;

  // Icon names
  showChatIcon: string = 'supervisor_account';
  interventionIcon: string = 'record_voice_over';
  fullscreenIcon: string = "fullscreen";
  playPauseIcon: string = "pause";
  volumeMuteIcon: string = "volume_up";

  // OpenVidu params
  private OV: OpenVidu;
  private OVSessionId: string;
  private OVToken: string;
  private OVPublisher: Publisher;
  private OVSession: Session;

  // Join form
  sessionName: string;
  participantName: string;

  // Session
  streams: Stream[] = [];
  streamIndex: number = 0;
  streamIndexSmall: number = 0;

  constructor(private authenticationService: AuthenticationService,
    private videoSessionService: VideoSessionService,
    private animationService: AnimationService,
    private route: ActivatedRoute,
    private location: Location) {
    this.user = this.authenticationService.getCurrentUser();
    this.mySession = this.videoSessionService.session;
    this.course = this.videoSessionService.course;
    this.teacherName = this.course.teacher.nickName;

    // Getting the session id from the url
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.mySessionId = id;
    });

    // Stablishing OpenVidu session
    this.generateParticipantInfo();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.removeUser();
    this.leaveSession();
  }

  ngAfterViewInit() {
    document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
  }

  ngOnInit() {

    this.getParamsAndJoin();

    let wsUri = environment.CHAT_URL;
    //this.websocket = new WebSocket(wsUri);
    this.websocket = new WebSocket("wss://" + window.location.hostname + ":" + window.location.port + "/chat")

    this.websocket.onopen = (event: Event) => { // Connection is open
      // New welcome chat line
      this.chatLines.push(new Chatline('system-msg', null, null, "Connected!", null)); // Notify user

      // Prepare json data
      let msg = {
        chat: 'Chat-Session-' + this.mySessionId,
        user: this.user.nickName,
        teacher: this.teacherName
      };
      // Convert and send data to server
      this.websocket.send(JSON.stringify(msg));
    }

    this.websocket.onmessage = (ev) => {
      var msg = JSON.parse(ev.data); // PHP sends Json data
      var type = msg.type; // Message type
      var umsg = msg.message; // Message text
      var uname = msg.name; // User name
      var ucolor = msg.color; // Color

      if (type == 'system') {
        // New system chat line
        this.chatLines.push(new Chatline('system-msg', null, null, umsg, null));
        this.animationService.animateToBottom('#message_box', 500);

      } else if (type == 'system-users') {
        // Users connected message received
        let jsonObject = JSON.parse(umsg);
        console.log("USERS CONNECTED:");
        console.log(jsonObject);
        this.usersConnected = [];
        if (jsonObject.hasOwnProperty('UserNameList')) {
          let objectY: any;
          for (var j = 0; j < jsonObject.UserNameList.length; j++) {
            objectY = jsonObject.UserNameList[j];
            // Add the URL picture of the user
            objectY["picture"] = this.getPhotoByName(objectY.userName);
            console.log(objectY);
            this.usersConnected.push(objectY);
          }
        }
      } else if ((type == 'system-intervention') && (this.authenticationService.isTeacher())) {
        // User's petition for intervention received
        let jsonObject = JSON.parse(umsg);
        console.log("USER PETITION:");
        console.log(jsonObject);
        if (jsonObject.hasOwnProperty('petition')) {
          if (jsonObject.petition) {
            // Add new user's petition
            jsonObject["accessGranted"] = false;
            jsonObject["picture"] = this.getPhotoByName(jsonObject.user);
            this.usersIntervention.push(jsonObject);
          }
          else {
            // Remove user's petition
            let index = this.usersIntervention.map(function (u) { return u.user; }).indexOf(jsonObject.user);
            if (index !== -1) {
              this.usersIntervention.splice(index, 1);
            }
          }
        }

        //FIXME: There is repeated code down here cause this is the foundation for the future updates and bug fixes

      } else if (type == 'system-grant-intervention') {
        // Teacher's intervention granted received by student
        let jsonObject = JSON.parse(umsg);
        console.log("TEACHER INTERVENTION GRANTED:");
        console.log(jsonObject);
        if (this.authenticationService.isStudent()) {
          if (jsonObject.hasOwnProperty('accessGranted')) {
            // For the granted student
            if (this.user.nickName == jsonObject.user) {
              console.log("ACCESS GRANTED FOR USER: " + jsonObject.user);
              if (jsonObject.accessGranted) {
                // Publish camera
                this.OVPublisher.publishVideo(true);
                this.OVPublisher.publishAudio(true);

                this.streamIndex = this.getStreamIndexByName(jsonObject.user);
                this.streamIndexSmall = this.getStreamIndexByName(this.teacherName);
                this.studentAccessGranted = true;
                this.myStudentAccessGranted = true;
              }
              else {
                this.OVPublisher.publishVideo(false);
                this.OVPublisher.publishAudio(false);

                this.streamIndex = this.getStreamIndexByName(this.teacherName);
                this.studentAccessGranted = false;
                this.myStudentAccessGranted = false;
                // Invert intervention request
                this.interventionRequired = !this.interventionRequired;
                // Change intervention icon
                this.interventionIcon = (this.interventionRequired ? 'cancel' : 'record_voice_over');
              }
            }
            // For the rest of students
            else {
              if (jsonObject.accessGranted) {
                this.streamIndex = this.getStreamIndexByName(jsonObject.user);
                this.streamIndexSmall = this.getStreamIndexByName(this.teacherName);
                this.studentAccessGranted = true;
              } else {
                this.streamIndex = this.getStreamIndexByName(this.teacherName);
                this.studentAccessGranted = false;
              }
            }
          }
        }
        else if (this.authenticationService.isTeacher()) {
          // For the teacher
          if (jsonObject.accessGranted) {
            this.streamIndex = this.getStreamIndexByName(jsonObject.user);
            this.streamIndexSmall = this.getStreamIndexByName(this.teacherName);
          } else {
            this.streamIndex = this.getStreamIndexByName(this.teacherName);
            this.studentAccessGranted = false;
          }
        }
      }
      else {
        let classUserMsg = (uname === this.user.nickName ? "own-msg" : "stranger-msg");
        // New user chat line
        this.chatLines.push(new Chatline(classUserMsg, uname, this.getPhotoByName(uname), umsg, ucolor));
        this.animationService.animateToBottom('#message_box', 500);
      }
    };

    this.websocket.onerror = (ev) => {
      // New system error chat line
      this.chatLines.push(new Chatline('system-err', null, null, 'Error Occurred - ' + ev.type, null));
      this.animationService.animateToBottom('#message_box', 500);
    };

    this.websocket.onclose = (ev) => {
      // New system close chat line
      this.chatLines.push(new Chatline('system-msg', null, null, 'Connection Closed', null));
      this.animationService.animateToBottom('#message_box', 500);
    };

    // Deletes the draggable element for the side menu (external to the menu itself in the DOM), avoiding memory leak
    $("div.drag-target").remove();
    this.volumeLevel = 1;
  }

  ngOnDestroy() {
    // Close the OpenVidu sesion
    this.leaveSession();
    // Delete the dark overlay (if side menu opened) when the component is destroyed
    $("#sidenav-overlay").remove();

    document.getElementsByTagName('body')[0].style.overflowY = 'initial';
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
    this.removeUser();
    this.leaveSession();
    this.location.back();
  }

  changeShowChat() {
    this.showChat = !this.showChat;
    this.showChatIcon = (this.showChat ? 'supervisor_account' : 'chat');
  }

  askForIntervention() {
    // Prepare json data
    let msg = {
      petitionIntervention: !this.interventionRequired
    };
    // Convert and send petition to server
    this.websocket.send(JSON.stringify(msg));
    // Invert intervention request
    this.interventionRequired = !this.interventionRequired;
    // Change intervention icon
    this.interventionIcon = (this.interventionRequired ? 'cancel' : 'record_voice_over');
  }

  grantIntervention(grant: boolean, userObject, i: number) {
    // Prepare json data
    let msg = {
      accessGranted: grant,
      user: userObject.user
    };
    // Convert and send petition to server
    this.websocket.send(JSON.stringify(msg));
    // Change control variable and user granted icon
    this.usersIntervention[i].accessGranted = grant;
    this.studentAccessGranted = grant;

    if (!this.studentAccessGranted) {
      // User connection terminated by teacher
      this.usersIntervention.splice(i, 1);
    }
  }

  getJsonFromString(str: string) {
    return JSON.parse(str);
  }

  getStreamIndexByName(name: string) {
    for (var i = 0; i < this.streams.length; i++) {
      if (this.getJsonFromString(this.streams[i].connection.data)['name'] === name) {
        return i;
      }
    }
    return -1;
  }

  getPhotoByName(userName: string) {
    let user = (this.course.attenders.filter(function (u) { return u.nickName == userName; }))[0];
    return user.picture;
  }


  /* Video controls */

  toggleFullScreen() {
    console.log("FULLSCREEN click");
    let fs = $('#video-session-div').get(0);
    var document: any = window.document;
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

  togglePlayPause() {
    let video = $('video')[0];
    if (video) {
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

  toggleMute() {
    console.log(this.volumeLevel);
    let video = $('video')[0];
    if (video) {
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

  changeVolume(event) {
    let video = $('video')[0];
    console.log(this.volumeLevel);
    video.volume = this.volumeLevel;
    this.changeVolumeIcon(video);
  }

  changeVolumeIcon(video) {
    if (video.volume > 0.65) this.volumeMuteIcon = "volume_up";
    else if (video.volume == 0.0) this.volumeMuteIcon = "volume_off";
    else this.volumeMuteIcon = "volume_down";
  }

  /* Video controls */


  /* OpenVidu */

  private generateParticipantInfo() {
    this.sessionName = this.mySession.title;
    this.participantName = this.user.nickName;
  }

  private addVideoTag(stream: Stream) {
    console.log("Stream added");
    this.streams.push(stream);
    if (this.getJsonFromString(stream.connection.data)['name'] === this.teacherName) {
      this.streamIndex = this.getStreamIndexByName(this.teacherName);
    }
  }

  private removeVideoTag(stream: Stream) {
    console.log("Stream removed");
    console.log(this.streams.indexOf(stream));
    console.log(this.streams.length);

    let ind = this.streams.indexOf(stream);
    this.streams.splice(ind, 1);
    if (this.getJsonFromString(stream.connection.data)['name'] === this.teacherName) {
      // Removing all streams if the teacher leaves the room
      this.streams = [];
      this.streamIndex = 0;
      this.studentAccessGranted = false;
      this.myStudentAccessGranted = false;
      this.interventionRequired = false;
    } else {
      if (this.streamIndex === ind) {
        // Back to teacher's stream if an active user leaves the room
        this.streamIndex = this.getStreamIndexByName(this.teacherName);
        this.studentAccessGranted = false;
      }
    }

    console.log(this.streams.length);
  }

  joinSession() {
    this.OV = new OpenVidu();
    this.OVSession = this.OV.initSession(this.OVSessionId);

    this.OVSession.on('streamCreated', (event) => {
      console.warn("STREAM CREATED");
      console.warn(event.stream);
      this.addVideoTag(event.stream);
      this.OVSession.subscribe(event.stream, 'nothing');
    });

    this.OVSession.on('streamDestroyed', (event) => {
      console.warn("STREAM DESTROYED");
      console.warn(event.stream);
      this.removeVideoTag(event.stream);
    });

    this.OVSession.on('connectionCreated', (event) => {
      console.warn("CONNECTION CREATED");
      console.warn(event.connection);
    });

    this.OVSession.on('connectionDestroyed', (event) => {
      console.warn("CONNECTION DESTROYED");
      console.warn(event.connection);
    });

    this.OVSession.connect(this.OVToken, (error) => {
      if (error) {
        console.log("Connect error"); return console.log(error);
      } else {
          if (this.authenticationService.isTeacher()) {
            this.OVPublisher = this.OV.initPublisher('nothing');
          } else {
            this.OVPublisher = this.OV.initPublisher('nothing', {audioActive:false, videoActive:false});
          }
          this.OVPublisher.on('accessAllowed', (event) => {
            console.warn("ACCESS ALLOWED");
          });
          this.OVPublisher.on('accessDenied', (event) => {
            console.warn("ACCESS DENIED");
          });
          this.OVPublisher.on('streamCreated', (event) => {
            console.warn("STREAM CREATED BY PUBLISHER");
            console.warn(event.stream);
            this.addVideoTag(event.stream);
          });
          this.OVPublisher.on('videoElementCreated', (event) => {
            console.warn("VIDEO ELEMENT CREATED BY PUBLISHER");
            console.warn(event.element);
          });
          this.OVSession.publish(this.OVPublisher);
        }
      });
  }

  getParamsAndJoin() {
    this.videoSessionService.getSessionIdAndToken(this.mySession.id).subscribe(
      sessionIdToken => {
        this.OVSessionId = sessionIdToken[0];
        this.OVToken = sessionIdToken[1];
        console.log(this.OVSessionId + " - " + this.OVToken);
        this.joinSession();
      },
      error => {
        console.warn("Error getting sessionId and token: " + error);
      }
    );
  }

  leaveSession() {
    this.websocket.close();  // Close the Chat websocket
    if (this.OVSession) this.OVSession.disconnect(); // Disconnect from Session
    this.streams = []; // Empty Stream array
    this.generateParticipantInfo();
  }

  removeUser() {
    this.videoSessionService.removeUser(this.mySessionId).subscribe(
        res => {
          console.log("User left the session");
        },
        error => {
          console.warn("Error removing user!");
        }
      );
  }
}
