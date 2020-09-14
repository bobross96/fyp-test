import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http : HttpClient
  ) { }

  login(user:any):Observable<any>{
    return this.http.post("/api/login",user)
  }



}

