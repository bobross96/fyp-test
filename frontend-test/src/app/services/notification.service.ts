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
    return this.http.delete("api/notification/delete/" + notifID)
  }

  postManyNotif(body : any):Observable<any>{
    return this.http.post("api/notification/create/many",body)
  }

  //all will be using this ..
  postNotifByProjectID(projectID:number,body: any):Observable<any>{
    return this.http.post("api/notification/createByProjectID/"+ projectID,body)
  }
}
