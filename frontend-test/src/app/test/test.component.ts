import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { TaskService } from '../services/task.service';
import {Task} from '../Task'
import { User } from '../User';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  tasks : Task[];
  users : User[];
  submitted = false
  model = new Task()
  task_types = ['Weekly Report','Interim Report','Final Report', 'I give up']
  statuses = ['Weekly','Late','Punctual','Anyhow']
  

  constructor(
    private api : ApiService,
    private taskApi : TaskService) { }

  onSubmit(){
    this.submitted = true
    console.log(this.model)
    this.taskApi.postTask(this.model).subscribe((res) => {
      console.log(res);
      
    })
    

  }


  getTasks():void{
    this.taskApi.getTasks().subscribe((res:any) => {
      this.tasks = res.data
      console.log(this.tasks);
      
    },err => {
      console.log(err)
    })
  }

  poop():void{
    console.log('poop!')
  }

  ngOnInit(): void {
    this.getTasks()
  }



}
