import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  {path : 'books', component:BooksComponent},
  {path : 'schedule',component:ScheduleComponent},
  {path : 'test', component:TestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
