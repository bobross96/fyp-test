import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './register/register.component';
import { TaskComponent} from './task/task.component'
import { TaskAllComponent } from './task-all/task-all.component';
import { TeamboardComponent} from './teamboard/teamboard.component';
import { AdminComponent } from './admin-app/admin/admin.component';
import { AdminLoginComponent } from './admin-app/admin-login/admin-login.component';
import { AdminUsersComponent } from './admin-app/admin-users/admin-users.component';
import { AdminProjectsComponent } from './admin-app/admin-projects/admin-projects.component';
import { AdminProjectComponent } from './admin-app/admin-project/admin-project.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'books', component: BooksComponent },
          { path: 'schedule', component: ScheduleComponent },
          { path: 'test', component: TestComponent },
          { path: 'task',component : TaskComponent},
          { path: 'allTasks',component : TaskAllComponent},
          { path: 'teamboard',component : TeamboardComponent}
        ],
      },
    ],
  },
  {
    path :'admin',
    component : AdminComponent,
    children : [
      {path : 'admin-users', component : AdminUsersComponent},
      {path : 'admin-projects',component : AdminProjectsComponent},
      {path : 'admin-project',component : AdminProjectComponent}
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component : RegisterComponent},
  {path : 'admin-login',component : AdminLoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
