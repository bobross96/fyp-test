import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  user:any
  constructor(private authService : AuthService,private router:Router) { }

  logout(){
    this.authService.logout()
    alert('logout successful')
    this.router.navigateByUrl('/login')
  }
  ngOnInit(): void {
    if (localStorage.getItem('user')){
    this.user = JSON.parse(localStorage.getItem('user'))
    
    }
  }

}
