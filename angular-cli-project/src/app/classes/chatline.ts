export class Chatline {

  public type: string; //[system-msg, system-err, own-msg, stranger-msg]
  public author: string;
  public message: string;
  public color: string;

  constructor(type: string, author: string, message: string, color: string){
    this.type = type;
    this.author = author;
    this.message = message;
    this.color = color;
  }

}
