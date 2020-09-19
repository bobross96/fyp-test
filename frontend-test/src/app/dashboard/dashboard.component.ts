import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user : any
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
