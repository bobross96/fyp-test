import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-task-all',
  templateUrl: './task-all.component.html',
  styleUrls: ['./task-all.component.scss']
})
export class TaskAllComponent implements OnInit {

  constructor(private api : ApiService) { }
  tasks : any

  ngOnInit(): void {
    this.api.getTasks().subscribe((res) => {
      this.tasks = res.data
      console.log(this.tasks);
      
    })
  
  }

  

}
