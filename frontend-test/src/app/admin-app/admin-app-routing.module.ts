import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminProjectComponent } from './admin-project/admin-project.component';
import { AdminProjectsComponent } from './admin-projects/admin-projects.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path :'admin',
    component : AdminComponent,
    canActivate : [AuthGuard],
    children : [
      {path : 'admin-users', component : AdminUsersComponent},
      {path : 'admin-projects',component : AdminProjectsComponent},
      {path : 'admin-project',component : AdminProjectComponent}
    ]
  },
  {path : 'admin-login',component : AdminLoginComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAppRoutingModule { }
