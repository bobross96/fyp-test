import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
    username : ['', Validators.required],
    email : ['', [Validators.required,Validators.email]],
    first_name : ['',Validators.required],
    last_name : ['',Validators.required],
    password : ['',Validators.required],
  });

  constructor(private loginApi : LoginService, 
    private _router : Router, 
    private authApi : AuthService,
    private fb : FormBuilder) { }

  ngOnInit(): void {
  }

  

  onSubmit(){
    if (this.registerForm.status == 'VALID'){
      this.registerForm.value.is_active = true 
      //make it only that students can make an account thru here, staff account is
      //given by admin
      //can modify if required
      this.registerForm.value.userType = 'Student'
      this.authApi.register(this.registerForm.value).subscribe((res) => {
        if (res.registerSuccess){
          this._router.navigateByUrl('/dashboard/schedule')
        }
        else {
          alert('error encountered in creating new user')
        }
      })  
    }
    

    
    
  }



}
