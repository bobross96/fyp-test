import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notification.service'
import { Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user : any
  userInfo : any
  notifications : any
  constructor(
    private authService : AuthService,
    private router:Router,
    private notifService : NotificationService) { }

  logout(){
    this.authService.logout()
    alert('logout successful')
    this.router.navigateByUrl('/login')
  }
  ngOnInit(): void {
    if (localStorage.getItem('userInfo')){
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log(this.userInfo);
    
    this.notifService.getUserNotif(this.userInfo.user.id).subscribe((notifications) => {
      if (notifications.data.length == 0){
        this.notifications = false
      }
      else {
        this.notifications = notifications.data
      }
      
      console.log(this.notifications);

      
      //console.log(this.notifications);
      
    })
    
    
    }
  }

  poop(id){
    //cos patch need body
    let body = {}
    this.notifService.setToRead(id,body).subscribe((response) => {
      console.log(response);
      this.notifService.getUserNotif(this.userInfo.user.id).subscribe((notifications) => {
        if (notifications.data.length == 0){
          this.notifications = false
        }
        else {
          this.notifications = notifications.data
        }
        
        console.log(this.notifications);
  
        
        //console.log(this.notifications);
        
      })
    })
    
  }

}
