import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(public router : Router,private route : ActivatedRoute, private api : ApiService) { }
  task : any
  
  ngOnInit(): void {

    let taskID = parseInt(this.route.snapshot.queryParamMap.get('id'))
    console.log(taskID);
    
    
    this.api.getTaskById(taskID).subscribe((res)=> {
      this.task = res.task
      console.log(res);
      this.task.submission_date = this.task.submission_date.substring(0,10)
      
    })
    //take the id from the url and get the task?
    
    
  }

  getTask(id:number){
    //will get the task?
  }

}
