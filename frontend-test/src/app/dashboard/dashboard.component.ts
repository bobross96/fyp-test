import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notification.service'
import { Router } from '@angular/router';
import { User } from '../User';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user : any
  userInfo : any
  notifications : any
  projects: any;
  selectedProject : any
  constructor(
    private authService : AuthService,
    private api : ApiService,
    private router:Router,
    private notifService : NotificationService) { }

  logout(){
    this.authService.logout()
    alert('logout successful')
    this.router.navigateByUrl('/login')
  }
  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.selectedProject = this.userInfo.selectedProject
    console.log(this.selectedProject);
    
    if (this.userInfo.user.userType == 'staff'){
      this.projects = this.userInfo.projectInfo
    }
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

  changeProject(){
    //fuck this method, just going to put inside localstorage
    this.api.changeProject(this.selectedProject)
    localStorage.setItem('selectedProject',this.selectedProject)
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
