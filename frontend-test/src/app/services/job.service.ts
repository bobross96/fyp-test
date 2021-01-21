import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private http : HttpClient
  ) { }

    getJobs(projectID : number):Observable<any>{
      return this.http.get("/api/jobs/" + projectID)
    }

    storeJobs(board : object):Observable<any>{
      return this.http.post("/api/jobs",board)
    }

    deleteJob(jobID : number):Observable<any>{
      return this.http.delete("/api/jobs/" + jobID)
    }




}
