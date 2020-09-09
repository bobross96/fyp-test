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

  postTask(task:any):Observable<any>{
    return this.http.post("/api/tasks",task)
  }

  deleteTask(taskID:number):Observable<any>{
    return this.http.delete("/api/tasks/" + taskID)
  }

  getBooks():Observable<any>{
    return this.http.get("/api/catalog/books")
  }

  getBook(id):Observable<any>{
    return this.http.get("/api/catalog/books/2")
  }

  getUsers():Observable<any>{
    return this.http.get("/api/users")
  }
}
