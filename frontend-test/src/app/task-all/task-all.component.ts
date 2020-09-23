import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

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
          task.submission_date = task.submission_date.substring(0,10)
      });
    })
  
  }

  taskView(id){
    this.router.navigateByUrl('/dashboard/task?id=' +id)
    
  }
  

}
