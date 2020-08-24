import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {Book} from '../book'

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books : Book[]
  
  getBooks():void{
    this.api.getBooks().subscribe((res:any) => {
      this.books = res.results;
      console.log(this.books)
    }, err => {
      console.log(err);
      
    })
  }


  constructor(private api : ApiService) { }



  
  ngOnInit(): void {
    this.getBooks()

  }

}
