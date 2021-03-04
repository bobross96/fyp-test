import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http : HttpClient
  ) { }


  //currently only fired upon login? maybe upon reload haha... or polling?
  getUserNotif(userID : number):Observable<any>{
    return this.http.get("/api/notification/" + userID)

  }

  //fired when task has been submitted, comment added

  setToRead(notifID : number,body):Observable<any>{
    return this.http.patch("api/notification/" + notifID,body)
  }

  //specifically for prof to take note
  postOneNotif(){

  }

  postManyNotif(body : any):Observable<any>{
    return this.http.post("api/notification/create/many",body)
  }
}
