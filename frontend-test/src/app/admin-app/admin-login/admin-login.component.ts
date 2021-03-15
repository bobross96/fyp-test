import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../services/login.service'
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  

  constructor(private _router : Router, private authApi : AuthService) { }

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  

  onSubmit(){
    
    this.authApi.loginAdmin(this.loginForm.value).subscribe(
      res => {
        this._router.navigateByUrl('/admin')
      },
      err => {
        if (err.error[0].message){
          alert(err.error[0].message)
        }
        else {
          alert(err.error)
        }
        
        
      }
    )
    
  }  

}
