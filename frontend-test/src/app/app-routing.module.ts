import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './register/register.component';
import { TaskComponent } from './task/task.component';
import { TaskAllComponent } from './task-all/task-all.component';
import { TeamboardComponent } from './teamboard/teamboard.component';

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
          { path: 'books', component: ProfileComponent },
          { path: 'schedule', component: ScheduleComponent },
          { path: 'test', component: TestComponent },
          { path: 'task', component: TaskComponent },
          { path: 'allTasks', component: TaskAllComponent },
          {
            path: 'teamboard',
            component: TeamboardComponent,
            canDeactivate: ['canDeactivateGuard'],
          },
        ],
      },
    ],
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    {
      provide: 'canDeactivateGuard',
      useValue: (
        component: TeamboardComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
      ) => true,
    },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
