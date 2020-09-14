import { Component, OnInit } from '@angular/core';
import {LoginService} from '../login.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginApi : LoginService, private _router : Router) { }

  ngOnInit(): void {
  }

  model = {
    email : "",
    password : ""
  }
  onSubmit(){
    console.log('poop');
    console.log(this.model);
    this.loginApi.login(this.model).subscribe((res) => {
      console.log(res);
      
    
      this._router.navigateByUrl('/dashboard')
      
    })
    
  }
}
