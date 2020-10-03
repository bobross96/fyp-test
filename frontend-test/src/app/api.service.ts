import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';




const apiUrl = "/api/catalog";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http : HttpClient,
  ) { }

  getTasks():Observable<any>{
    return this.http.get("/api/tasks")
  }

  getTaskById(taskID:number):Observable<any>{
    return this.http.get("/api/tasks/" + taskID)
  }

  postTask(task:any):Observable<any>{
    console.log('in post task');
    return this.http.post("/api/tasks",task)
  }

  deleteTask(taskID:number):Observable<any>{
    return this.http.delete("/api/tasks/" + taskID)
  }

  editTask(taskID:number, task:any):Observable<any>{
    return this.http.put("/api/tasks/" + taskID,task)
  }

  submitTask(taskID:number,task):Observable<any>{
    return this.http.put("/api/tasks/submit/"+taskID,task)
  }


  getUsers():Observable<any>{

    return this.http.get("/api/users")
  }

  getCommentsByTask(taskID:number):Observable<any>{
    return this.http.get("/api/comments/task/" + taskID)
  }

  postComment(comment:any):Observable<any>{
    return this.http.post("api/comments",comment)
  }


  postDocument(file:any,taskID:number):Observable<any>{
    return this.http.post("api/documents/"+taskID,file)
  }

  getDocument(taskID:number):Observable<any>{
    return this.http.get("api/documents/" + taskID)
  }

  deleteDocument(fileID:number):Observable<any>{
    return this.http.delete("api/documents/delete/"+fileID)
  }

}
