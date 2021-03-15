import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';




const apiUrl = "/api/catalog";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //1 is defualt message?

  private projectSource = new BehaviorSubject(JSON.parse(localStorage.getItem('selectedProject')));
  currentProject = this.projectSource.asObservable();

  constructor(
    private http : HttpClient,
  ) { }

  changeProject(projectID:number):void{
    this.projectSource.next(projectID)
  }
 
  fetchByProject(projectID:number):Promise<any>{
    return this.http.get("/api/users/" + projectID).toPromise()
  }

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

  getSemDate(){
    return this.http.get("api/semester")
  }




}
