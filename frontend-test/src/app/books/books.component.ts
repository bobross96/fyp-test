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
 


  constructor(private api : ApiService) { }




  getUsers():void{
    this.api.getUsers().subscribe((res:any) => {
      console.log(res);
      this.users = res.data
    })
  }

  
  ngOnInit(): void {
    this.getUsers()


  }

}
