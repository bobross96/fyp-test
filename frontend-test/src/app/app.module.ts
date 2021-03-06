import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AdminAppModule} from './admin-app/admin-app.module'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { httpInterceptorProviders } from './http-interceptors/index';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import {
  ScheduleComponent,
  DialogOverviewExampleDialog,
  EditEventDialog,
  WeekNumber,
} from './schedule/schedule.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { TestComponent } from './test/test.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { MatRadioModule } from '@angular/material/radio';
import { TaskComponent, DialogEdit, DialogPdf } from './task/task.component'
import { MatCardModule } from '@angular/material/card';
import { TaskAllComponent } from './task-all/task-all.component'
import { MatExpansionModule } from '@angular/material/expansion'
import {MatGridListModule} from '@angular/material/grid-list';
import { CommentsComponent } from './comments/comments.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';
import { AdminComponent } from './admin-app/admin/admin.component';
import { AdminLoginComponent} from './admin-app/admin-login/admin-login.component';
import { AdminUsersComponent,DialogAddUser,DialogEditUser } from './admin-app/admin-users/admin-users.component';
import { AdminProjectsComponent,DialogAddProject } from './admin-app/admin-projects/admin-projects.component';
import { AdminProjectComponent } from './admin-app/admin-project/admin-project.component';
import { MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort'; 
import {MatPaginatorModule} from '@angular/material/paginator';
import { TeamboardComponent, DialogJob } from './teamboard/teamboard.component'; 
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge'; 
import {NgApexchartsModule} from 'ng-apexcharts'



FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    ScheduleComponent,
    TestComponent,
    DialogOverviewExampleDialog,
    EditEventDialog,
    WeekNumber,
    LoginComponent,
    PageNotFoundComponent,
    DashboardComponent,
    RegisterComponent,
    TaskComponent,
    TaskAllComponent,
    DialogEdit,
    DialogPdf,
    CommentsComponent,
    AdminComponent,
    AdminLoginComponent,
    AdminUsersComponent,
    DialogEditUser,
    DialogAddUser,
    AdminProjectsComponent,
    DialogAddProject,
    AdminProjectComponent,
    TeamboardComponent,
    DialogJob
    
  ],
  imports: [
    BrowserModule,
    AdminAppModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    NgbModalModule,
    FullCalendarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatRadioModule,
    MatCardModule,
    MatExpansionModule,
    MatGridListModule,
    PdfViewerModule,
    NgxDocViewerModule,
    NgxMatDatetimePickerModule, 
    NgxMatNativeDateModule, 
    NgxMatTimepickerModule, 
    NgbModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DragDropModule,
    MatSnackBarModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatChipsModule,
    MatBadgeModule,
    NgApexchartsModule
    
  ],
  providers: [httpInterceptorProviders, MatDatepickerModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
