import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { FileGroup }             from '../classes/file-group';
import { File }             from '../classes/file';
import { CourseDetails }         from '../classes/course-details';
import { AuthenticationService } from './authentication.service';


import 'rxjs/Rx';

@Injectable()
export class FileService {

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  private url = "/files";

  //POST new FileGroup. Requires the FileGroup and the courseDetails id that owns it
  //On success returns the entire updated CourseDetails
  public newFileGroup(fileGroup: FileGroup, courseDetailsId: number){
    let body = JSON.stringify(fileGroup);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.post(this.url + "/" + courseDetailsId, body, options)
      .map(response => response.json() as CourseDetails)
      .catch(error => this.handleError(error));
  }

  //POST new File. Requires the File, the FileGroup id that owns it and their courseDetails id
  //On success returns
  public newFile(file: File, fileGroupId: number, courseDetailsId: number){
    let body = JSON.stringify(file);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.post(this.url + "/file-group/" + fileGroupId + "/course/" + courseDetailsId, body, options)
      .map(response => response.json() as FileGroup)
      .catch(error => this.handleError(error));
  }

  //DELETE existing File. Requires the file id, the fileGroup id that owns it and their course's id
  //On succes returns the deleted File
  public deleteFile(fileId: number, fileGroupId: number, courseId: number){
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.delete(this.url + "/delete/file/" + fileId + "/file-group/" + fileGroupId + "/course/" + courseId, options)
      .map(response => response.json() as File)
      .catch(error => this.handleError(error));
  }

  //DELETE existing FileGroup. Requires the fileGroup id and its course's id
  //On succes returns the deleted FileGroup
  public deleteFileGroup(fileGroupId: number, courseId: number){
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.delete(this.url + "/delete/file-group/" + fileGroupId + "/course/" + courseId, options)
      .map(response => response.json() as FileGroup)
      .catch(error => this.handleError(error));
  }

  /*//PUT existing FileGroup. Requires
  //On success returns
  public editFileGroup(){
    let body = JSON.stringify(comment);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.urlNewComment + "/entry/" + entryId + "/forum/" + courseDetailsId, body, options)
      .map(response => response.json() as Entry)
      .catch(error => this.handleError(error));
  }

  //DELETE existing FileGroup. Requires
  //On success returns
  public deleteFileGroup(){
    let body = JSON.stringify(activated);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.delete(this.urlEditForum + "/edit/" + courseDetailsId, body, options)
      .map(response => response.json() as boolean)
      .catch(error => this.handleError(error));
  }*/

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}
