import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';

import {User} from '../User'

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  users : User[]
  projectID : number


  constructor(private api : ApiService) {
    this.projectID = JSON.parse(localStorage.getItem('userType')).project_id
   }


  
  
  getUsers(projectID):void{
    this.api.showByProject(projectID).subscribe((res:any) => {
      console.log(res);
      this.users = res.message
    })
  }

  

  
  ngOnInit(): void {
    this.getUsers(this.projectID)
    
    

  }

}
