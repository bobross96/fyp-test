import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private _router: Router, private authApi: AuthService) {}

  ngOnInit(): void {}

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    console.log(this.loginForm.status);
    
    if (this.loginForm.status == 'VALID') {
      this.authApi.login(this.loginForm.value).subscribe(
        (res) => {
          console.log(localStorage.getItem('token_id'));
          this._router.navigateByUrl('/dashboard/schedule');
        },
        (err) => {
          console.log(err);
          alert(err.error[0].message);
        }
      );
    }
    else {
      alert('Please fill up the empty fields!')
    }
  }
}
