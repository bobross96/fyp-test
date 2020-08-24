import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';




const apiUrl = "/api/catalog";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http : HttpClient,
  ) { }


  getBooks():Observable<any>{
    return this.http.get("/api/catalog/books")
  }

  getBook(id):Observable<any>{
    return this.http.get("/api/catalog/books/2")
  }
}
