import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
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
  

  constructor(private api : ApiService) { }

  onSubmit(){
    this.submitted = true
    console.log(this.model)
    this.api.postTask(this.model).subscribe((res) => {
      console.log(res);
      
    })
    

  }


  getTasks():void{
    this.api.getTasks().subscribe((res:any) => {
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
