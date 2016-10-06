import { Entry } from './entry';

export class Forum {
  constructor(
    public activated: boolean,
    public entries: Entry[]) { }
}
