import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params}  from '@angular/router';
import { Location }               from '@angular/common';

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
  sessionId: number;

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, private location: Location) {
    this.user = this.authenticationService.getCurrentUser();
  }

  ngOnInit() {
    //Getting the session id from the url
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.sessionId = id;
    });

    let wsUri = "ws://" + document.location.host + "/chat";
    this.websocket = new WebSocket(wsUri);
    let thisAux = this;

    this.websocket.onopen = function(event: Event) { // connection is open
      $('#message_box').append("<div class=\"system_msg\">Connected!</div>"); //notify user
      //prepare json data
      let msg = {
        chat: 'Chat-Session-' + thisAux.sessionId,
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
          "<div class=\"system_msg\">" + umsg
          + "</div>");
      } else {
        $('#message_box').append(
          "<div><span class=\"user_name\" style=\"color:#" + ucolor + "\">"
          + uname
          + "</span> : <span class=\"user_message\">"
          + umsg
          + "</span></div>");
      }

      $('#message').val(''); //reset text
    };

    this.websocket.onerror = function(ev) {
      $('#message_box').append("<div class=\"system_error\">Error Occurred - " + ev.message + "</div>");
    };

    this.websocket.onclose = function(ev) {
      $('#message_box').append("<div class=\"system_msg\">Connection Closed</div>");
    };

    //Deletes the draggable element for the side menu (external to the menu itself in the DOM), avoiding memory leak
    $("div.drag-target").remove();
  }

  ngOnDestroy() {
    //Closing the Chat websocket
    this.websocket.close()
    //Delets the dark overlay (if side menu opened) when the component is destroyed
    $("#sidenav-overlay").remove();
  }

  sendMessage(){
    var mymessage = $('#message').val(); //get message text
    //var myname = $('#name').val(); //get user name
    if (mymessage == "") { //emtpy message?
      alert("Enter Some message Please!");
      return;
    }
    //prepare json data
    var msg = {
      message: mymessage,
      user: this.user.nickName
    };
    //convert and send data to server
    this.websocket.send(JSON.stringify(msg));
  }

  exitFromSession(){
    this.location.back();
  }

}
