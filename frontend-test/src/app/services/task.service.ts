import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http : HttpClient
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
}
