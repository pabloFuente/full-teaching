import { File } from './file';

export class FileGroup {

  public id?: number;
  public title: string;
  public files: File[];
  public fileGroups: FileGroup[];

}
