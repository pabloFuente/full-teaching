export class File {
  constructor(
    public type: number, // 0 -> web-link | 1 -> pdf | 2 -> video
    public link: string) {}
}
