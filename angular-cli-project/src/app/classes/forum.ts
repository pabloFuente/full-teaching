import { Entry } from './entry';

export class Forum {

  public id?: number;
  public activated: boolean;
  public entries: Entry[];

  constructor(activated: boolean){
    this.activated = activated;
    this.entries = [];
  }

}
