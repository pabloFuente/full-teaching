export class File {

  public id?: number;
  public type: number; // 0 -> web-link | 1 -> pdf | 2 -> video
  public name: string;
  public link: string;

  constructor(type: number, name: string, link: string){
    this.type = type;
    this.name = name;
    this.link = link;
  }

}
