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

  constructor(
    private api : ApiService, 
    private router : Router,
    private route : ActivatedRoute) { }
  tasks : any
  panelOpenState = false;
  taskType : any

  ngOnInit(): void {
    this.route.queryParams.subscribe(queries => {
      console.log(queries);
      switch (queries.taskType) {
        case 'weeklyReports':
          this.taskType = 'Weekly Report'
          break;
        case 'meetingNotes':
          this.taskType = 'Meeting Notes'
          break;
        default:
          this.taskType = null;
          break;
      }

      this.tasks = []
      this.api.getTasks().subscribe((res) => {
        this.tasks = res.data
        console.log(this.tasks);
        //changes date to readable format 


        // please refactor lol
        this.tasks = this.tasks.filter(task => {
          if (this.taskType){
            return task.task_type == this.taskType
          } 
          
          else {
            return task.task_type != 'Weekly Report' && task.task_type != 'Meeting Notes'
          }
        
        })

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
      
    })
    //console.log(taskID);
    
    
  
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
