import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';
import { JobService } from '../services/job.service';

import {User} from '../User'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  users : User[]
  userInfo : any
  projectID : number
  jobs : any[]
  todo : any[] = []
  doing : any[] = []
  done : any[] = []
  archived : any[] = []
  isStudent : boolean = true
  staffProjects : any
  totalHours : number



  constructor(
    private api : ApiService,
    private jobApi : JobService) {
    this.projectID = JSON.parse(localStorage.getItem('selectedProject'));
    console.log(this.projectID);
   
  }


  ngOnInit(): void {

    //display own user data
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (this.userInfo.user.userType == 'staff'){
      console.log(this.userInfo);
      
      this.isStudent = false
      this.staffProjects = this.userInfo.projectInfo
      console.log(this.staffProjects);
      
    }


    this.jobApi.getJobsByUserID(this.userInfo.user.id).subscribe((res:any) => {
      console.log(res);
      this.jobs = res.jobs
      this.jobs.forEach(job => {
        switch (job.status) {
          case 'todo':
            this.todo.push(job)
            break;
          case 'doing':
            this.doing.push(job)
            break;
          case 'done':
            this.done.push(job)
            break;
          case 'archived':
            this.archived.push(job)
          default:
            break;
        }
      });

      //get total hours 
      this.totalHours = this.jobs.reduce((acc,curr) => {
        return acc + curr.hours_spent
      },0)

      console.log(this.totalHours);
      
      
    })
    //gets all users tagged to the project
    this.api.showByProject(this.projectID).subscribe((res:any) => {
      console.log(res);
      this.users = res.message
    })


    
    

  }

}
