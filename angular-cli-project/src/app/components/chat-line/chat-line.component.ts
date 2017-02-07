import { Component, Input } from '@angular/core';

import { Chatline } from '../../classes/chatline';

@Component({
  selector: 'app-chat-line',
  templateUrl: './chat-line.component.html',
  styleUrls: ['./chat-line.component.css']
})
export class ChatLineComponent {

  @Input()
  public chatLine: Chatline;

  constructor() { }

}
