import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private http : HttpClient
  ) { }

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

