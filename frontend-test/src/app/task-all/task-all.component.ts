import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as helper from '../functions/helper'

@Component({
  selector: 'app-task-all',
  templateUrl: './task-all.component.html',
  styleUrls: ['./task-all.component.scss']
})
export class TaskAllComponent implements OnInit {

  constructor(private api : ApiService, private router : Router) { }
  tasks : any
  panelOpenState = false;
  ngOnInit(): void {
    this.api.getTasks().subscribe((res) => {
      this.tasks = res.data
      console.log(this.tasks);
      //changes date to readable format 
      this.tasks.forEach(task => {
        if (task.task_due_date){
        task.weekNumber = helper.getSchoolWeek(task.task_due_date)  
        task.task_due_date = task.task_due_date.substring(0,10)
        }
        if (task.submission_date){
        task.submission_date = task.submission_date.substring(0,10)
        }
          
      });
    })
  
  }

  taskView(id){
    this.router.navigateByUrl('/dashboard/task?id=' +id)
    
  }

  getTaskColour(taskType){
    let color = 'grey'
    switch (taskType) {
      case 'Pending':
        color = 'blue'
        break;
      case 'Completed':
        color = 'green'
        break;
      case 'Late':
        color = 'red'
        break;
      default:
        color = 'grey'
        break;
      }

      return color
  }
  

}
