import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, BrowserXhr } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import * as FileSaver from "file-saver";

import { FileGroup }             from '../classes/file-group';
import { File }                  from '../classes/file';
import { CourseDetails }         from '../classes/course-details';
import { AuthenticationService } from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class FileService {

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  private url = "/api-files";

  private pendingDownload: boolean = false;

  //POST new FileGroup. Requires the FileGroup and the courseDetails id that owns it
  //On success returns the entire updated CourseDetails
  public newFileGroup(fileGroup: FileGroup, courseDetailsId: number) {
    let body = JSON.stringify(fileGroup);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.post(this.url + "/" + courseDetailsId, body, options)
      .map(response => response.json() as CourseDetails)
      .catch(error => this.handleError(error));
  }

  //DELETE existing FileGroup. Requires the fileGroup id and its course's id
  //On succes returns the deleted FileGroup
  public deleteFileGroup(fileGroupId: number, courseId: number) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.delete(this.url + "/delete/file-group/" + fileGroupId + "/course/" + courseId, options)
      .map(response => response.json() as FileGroup)
      .catch(error => this.handleError(error));
  }

  //DELETE existing File. Requires the file id, the fileGroup id that owns it and their course's id
  //On succes returns the deleted File
  public deleteFile(fileId: number, fileGroupId: number, courseId: number) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.delete(this.url + "/delete/file/" + fileId + "/file-group/" + fileGroupId + "/course/" + courseId, options)
      .map(response => response.json() as File)
      .catch(error => this.handleError(error));
  }

  //PUT existing FileGroup. Requires the modified FileGroup and the course id
  //On success returns the updated root FileGroup
  public editFileGroup(fileGroup: FileGroup, courseId: number) {
    let body = JSON.stringify(fileGroup);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.url + "/edit/file-group/course/" + courseId, body, options)
      .map(response => response.json() as FileGroup)
      .catch(error => this.handleError(error));
  }

  //PUT 2 FileGroups. Requires the id of the file moved, the ids of the source and the target FileGroups, the id of the Course and the position of the file in the target FileGroup
  //On success returns the all the fileGroups of the course
  public editFileOrder(fileMovedId: number, fileGroupSourceId: number, fileGroupTargetId: number, filePosition: number, courseId: number) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.url + "/edit/file-order/course/" + courseId + "/file/" + fileMovedId + "/from/" + fileGroupSourceId + "/to/" + fileGroupTargetId + "/pos/" + filePosition, options)
      .map(response => response.json() as FileGroup[])
      .catch(error => this.handleError(error));
  }

  //PUT existing File. Requires the modified File and the course id
  //On success returns the updated root FileGroup
  public editFile(file: File, fileGroupId: number, courseId: number) {
    let body = JSON.stringify(file);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.url + "/edit/file/file-group/" + fileGroupId + "/course/" + courseId, body, options)
      .map(response => response.json() as FileGroup)
      .catch(error => this.handleError(error));
  }

  public downloadFile(courseId: number, file: File) {

    // Xhr creates new context so we need to create reference to this
    let self = this;

    // Status flag used in the template.
    this.pendingDownload = true;

    // Create the Xhr request object
    let xhr = new XMLHttpRequest();
    let url = "/api-load-files/course/" + courseId + "/download/" + file.id;
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    // Xhr callback when we get a result back
    // We are not using arrow function because we need the 'this' context
    xhr.onreadystatechange = function() {

      // We use setTimeout to trigger change detection in Zones
      setTimeout(() => { self.pendingDownload = false; }, 0);

      // If we get an HTTP status OK (200), save the file using fileSaver
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(this.response);
        var blob = new Blob([this.response], { type: this.response.type });
        FileSaver.saveAs(blob, file.name);
      }
    };

    // Start the Ajax request
    xhr.send();
  }

  private openFile(response) {
    console.log(response);
    var blob = new Blob([response._body], { type: 'text/plain' });
    var url = window.URL.createObjectURL(blob);
    window.open(url)
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}
