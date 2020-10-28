import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../login.service'
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  constructor(private _router : Router, private authApi : AuthService) { }

  ngOnInit(): void {
  }

  model = {
    email : "",
    password : ""
  }

  onSubmit(){
    console.log('poop');
    console.log(this.model);
    this.authApi.loginAdmin(this.model).subscribe((res) => {
      console.log(res);
      
      if (res.loginSuccess){
     
        console.log(localStorage.getItem('token_id'));
      
        this._router.navigateByUrl('/admin')
      }
      else {
        alert('username/password incorrect!')
      }
    })
    
  }  

}
