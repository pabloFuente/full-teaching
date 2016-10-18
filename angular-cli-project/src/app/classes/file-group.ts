import { File } from './file';

export class FileGroup {
  constructor(
    public title: string,
    public files: File[],
    public fileGroups: FileGroup[]) {}
}
