import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service'
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor( private _router : Router, private authApi : AuthService) { }

  ngOnInit(): void {
  }

  model = {
    email : "",
    password : ""
  }
  onSubmit(){
    console.log('poop');
    console.log(this.model);
    this.authApi.login(this.model).subscribe(
      res => {
        console.log(localStorage.getItem('token_id'));
        this._router.navigateByUrl('/dashboard/schedule') 
      },
      err => {
        console.log(err);
        alert(err.error[0].message)}
      
    )
    
  }
}
