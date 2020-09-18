import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  redirectUrl : string;

  login(user:any):Observable<any>{
    return this.http.post("/api/login",user).pipe(
      tap(val => {
        //will only set local storage true here
        if (val.loginSuccess){
        this.setSession(val)
        this.isLoggedIn = true
        }
    })
    )
  }

  private setSession(authResult){
    console.log(authResult);
    localStorage.setItem('token_id', authResult.token.token)
    console.log(localStorage.getItem('token_id'));

  }

  constructor(private http : HttpClient) { }
}
