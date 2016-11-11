import { File } from './file';

export class FileGroup {

  public id?: number;
  public title: string;
  public files: File[];
  public fileGroups: FileGroup[];
  public fileGroupParent: FileGroup;

  constructor(title: string, fileGroupParent: FileGroup){
    this.title = title;
    this.fileGroupParent = fileGroupParent;
    this.files = [];
    this.fileGroups = [];
  }

}
