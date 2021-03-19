import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;

  login(user: any): Observable<any> {
    return this.http.post('/api/login', user).pipe(
      tap((val) => {
        //will only set local storage true here
        if (val) {
          this.setSession(val);
          this.isLoggedIn = true;
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post('/api/register', user).pipe(
      tap((val) => {
        if (val.registerSuccess) {
          this.setSession(val);
          this.isLoggedIn = true;
        }
      })
    );
  }

  loginAdmin(user: any): Observable<any> {
    return this.http.post('/api/admin-login', user).pipe(
      tap((val) => {
        if (val.loginSuccess) {
          this.setAdminSession(val);
          this.isLoggedIn = true;
        }
      })
    );
  }

  checkValidToken(token: any): Observable<any> {
    return this.http.post('/api/token', token).pipe(
      tap((val) => {
        return val;
      })
    );
  }

  private setSession(authResult) {
    localStorage.setItem('token_id', authResult.token.token);
    //store user and student object inside localStorage

    //if user,

    //if student
    if (authResult.groupMates) {
      const userInfo = JSON.stringify({
        user: authResult.user,
        subTypeInfo: authResult.subTypeInfo,
        projectInfo: authResult.projectInfo,
        groupMates: authResult.groupMates,
        staff: authResult.staff,
        selectedProject: authResult.projectInfo.id,
      });
      localStorage.setItem('userInfo', userInfo);
      localStorage.setItem('selectedProject',authResult.projectInfo.id)
    }
    //if staff
    else {
      const userInfo = JSON.stringify({
        user: authResult.user,
        subTypeInfo: authResult.subTypeInfo,
        projectInfo: authResult.projectInfo,
        selectedProject: authResult.projectInfo[0].id,
      });

      localStorage.setItem('userInfo', userInfo);
      localStorage.setItem('selectedProject',authResult.projectInfo[0].id)
    }
  }

  private setAdminSession(authResult) {
    localStorage.setItem('token_id', authResult.token.token);
    const adminInfo = JSON.stringify({
      user: authResult.user,
    });

    localStorage.setItem('adminInfo', adminInfo);
  }

  logout() {
    localStorage.clear();
  }

  constructor(private http: HttpClient) {}
}
