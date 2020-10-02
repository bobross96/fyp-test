import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { httpInterceptorProviders } from './http-interceptors/index';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksComponent } from './books/books.component';
import {
  ScheduleComponent,
  DialogOverviewExampleDialog,
  EditEventDialog,
  WeekNumber,
} from './schedule/schedule.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
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
import { TaskComponent, DialogEdit } from './task/task.component'
import { MatCardModule } from '@angular/material/card';
import { TaskAllComponent } from './task-all/task-all.component'
import { MatExpansionModule } from '@angular/material/expansion'
import {MatGridListModule} from '@angular/material/grid-list';
import { CommentsComponent } from './comments/comments.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
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
    CommentsComponent
  ],
  imports: [
    BrowserModule,
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
    PdfViewerModule
  ],
  providers: [httpInterceptorProviders, MatDatepickerModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
