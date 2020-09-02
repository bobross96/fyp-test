import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Book } from './book';
import { BooksComponent } from './books/books.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  {path : 'books', component:BooksComponent},
  {path : 'schedule',component:ScheduleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
