import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {Book} from '../book'
import {User} from '../User'

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books : Book[]
  users : User[]
 


  constructor(private api : ApiService) { }

  getBooks():void{
    this.api.getBooks().subscribe((res:any) => {
      this.books = res.results;
      console.log(this.books)
    }, err => {
      console.log(err);
      
    })
  }

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
