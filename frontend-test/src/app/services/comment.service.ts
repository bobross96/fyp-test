import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http : HttpClient,
  ) { }

  getCommentsByTask(taskID:number):Observable<any>{
    return this.http.get("/api/comments/task/" + taskID)
  }

  postComment(comment:any):Observable<any>{
    return this.http.post("api/comments",comment)
  }



}
