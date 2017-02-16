export class Chatline {

  public type: string; //[system-msg, system-err, own-msg, stranger-msg]
  public author: string;
  public picture: string;
  public message: string;
  public color: string;

  constructor(type: string, author: string, picture: string, message: string, color: string){
    this.type = type;
    this.author = author;
    this.picture = picture;
    this.message = message;
    this.color = color;
  }

}
