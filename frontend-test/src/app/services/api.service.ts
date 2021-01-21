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

 
  showByProject(projectID:number):Observable<any> {
    return this.http.get("/api/users/" + projectID)
  }

  getUsers():Observable<any>{

    return this.http.get("/api/users")
  }

  getProjects():Observable<any>{
    return this.http.get("api/projects")
  }

  getProjectByID(projectID : number):Observable<any>{
    return this.http.get("api/projects/" + projectID)
  }

  addProject(projectData: any):Observable<any>{
    return this.http.post("api/projects",projectData)
  } 


  delinkUserToProject(data : any):Observable<any>{
    return this.http.post("api/projects/delinkUserToProject",data)
  }

  linkUserToProject(data : any):Observable<any>{
    return this.http.post("api/projects/linkUserToProject",data)
  }

  addUser(userData:any):Observable<any>{
    return this.http.post("api/register",userData)

  }

}
