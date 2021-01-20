import {
  Component,
  OnInit,
  Inject,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import * as helper from '../functions/helper';
import {
  FullCalendarComponent,
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  DayHeader,
  DayCellContent, CalendarApi
} from '@fullcalendar/angular'; // useful for typechecking
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { ApiService } from '../services/api.service';
import { TaskService } from '../services/task.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

export interface DialogData {
  title: string;
  content: string;
}
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  thisSem = 1;
  calendarVisible = true;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },

    initialView: 'dayGridMonth',
    weekends: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    //everytime some event changes this runs
    eventsSet: this.handleEvents.bind(this),
    eventAdd: this.handleEventAdd.bind(this),
    eventRemove: this.handleEventRemove.bind(this),
    eventDisplay: 'auto',
    displayEventEnd: true,
    weekNumbers: true,
    weekText: `Sem 1 Week `,
    contentHeight: 'auto',
    weekNumberContent: function (arg) {
      if (!arg.num || arg.num < 0 || arg.num > 14) {
        arg.text = 'Break';
      } else if (arg.num == 8) {
        arg.text = 'Recess Week';
      } else if (arg.num > 8) {
        arg.text = `Sem 2 Week ${arg.num - 1}`;
      }
    },
    weekNumberCalculation: function (local) {
      let startDate = new Date('1/11/2021');
      let intNumber =
        Math.ceil(
          (local.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7)
        ) + 1;

      return intNumber;
    },
  };

  currentEvents: EventApi[] = [];

  //bool to check for form showing
  showForm = false;
  tasks: any = [];
  fetchedTasks: any = [];
  user: any;
  userType: any;
  projects: any;
  project_id: any;
  // follows value from html page
  selectedProject;
  studentProject: any;
  time: any;
  startDate: any;
  endDate: any;

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleEventAdd(addInfo?) {
    //console.log(addInfo);
  }

  handleEventRemove(removeInfo) {
    console.log(removeInfo.event);
    let db_id = removeInfo.event._def.extendedProps.db_id;
    if (db_id) {
      this.removeFromDB(db_id);
    }
  }
  delete = false;
  title: string;
  content: string;
  status: string;
  task_type: string;
  date: Date;
  hours_spent: number;
  handleDateSelect(selectInfo?: DateSelectArg) {
    //const title = prompt('Please enter a new title for your event');
    // const content = prompt('Content')

    console.log(this.calendarComponent);

    // selects the calendar component
    const calendarApi = this.calendarComponent['calendar'];
    //const calendarApi2 = selectInfo.view.calendar

    console.log(calendarApi);
    //console.log(calendarApi2);

    this.showForm = true;
    calendarApi.unselect(); // clear date selection
    console.log(selectInfo);
    if (!selectInfo) {
      this.date = new Date();
    } else {
      this.date = new Date(selectInfo.startStr);
    }

    let startTime, endTime;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: {
        task_type: this.task_type,
        date: this.date,
        startTime: startTime,
        endTime: endTime,
        showDate: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      //insert post request here
      console.log(result);
      //console.log(this.title);
      if (!result) {
        return;
      } else if (result.date && result.task_type) {
        console.log(this.userType);

        if (this.userType.type == 'staff') {
          if (!this.selectedProject) {
            alert('please select a project!');
            return;
          }
          this.project_id = this.selectedProject;
        } 
        if (!result.startTime) {
          this.startDate = null;
        }
        if (!result.endTime) {
          this.endDate = null;
        }
        if (result.startTime) {
          this.startDate = helper.dateConverter(
            result.date,
            result.startTime.hour,
            result.startTime.minute
          );
        }
        if (result.endTime) {
          this.endDate = helper.dateConverter(
            result.date,
            result.endTime.hour,
            result.endTime.minute
          );
        }

        const task = {
          task_due_date: result.date,
          task_type: result.task_type,
          status: 'Pending',
          user_id: this.user.id,
          project_id: this.project_id,
          start_date: this.startDate,
          end_date: this.endDate,
        };
        console.log(task);

        this.taskApi.postTask(task).subscribe((result) => {
          helper.singleTaskToEvent(result.task,calendarApi,createEventId)
        });
      } else {
        alert('Task not saved, form was incomplete');
      }
    });

    /* */
    //add to view, this is the event that will be checked

    /* 
      }) */
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo);
    let title = clickInfo.event._def.title;
    let toDelete = false;
    let toView = false;
    let task = {};
    const dialogRef = this.dialog.open(EditEventDialog, {
      data: {
        title: clickInfo.event._def.title,
        delete: false,
      },
    });

    const subscribeDialog = dialogRef.componentInstance.deleteTask.subscribe(
      (data) => {
        console.log('dialog data', data);
        if (data.delete) {
          toDelete = true;
        }
      }
    );

    const viewTask = dialogRef.componentInstance.viewTask.subscribe((data) => {
      if (data.view) {
        console.log(clickInfo.event._def);
        toView = true;
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      subscribeDialog.unsubscribe();
      console.log('dialogue log was closed');
      if (toDelete) {
        console.log(clickInfo.event);

        clickInfo.event.remove();
        //delete from db as well
      } else if (toView) {
        this.navigateToTask(clickInfo.event._def.extendedProps.db_id);
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  changeProject() {
    this.project_id = this.selectedProject;
    console.log(this.selectedProject);

    this.getTasksForStaff();
  }

  getTasksForStaff() {
    //clears the calendar
    const calendarApi = this.calendarComponent['calendar'];
    calendarApi.removeAllEvents()

    const filteredTasks = this.fetchedTasks.filter(
      (task) => task.project_id == this.selectedProject
    );

    this.taskToEvent(filteredTasks);

    //set tasks based on project id chosen
    console.log(this.userType);

    // fetch depending on the id of project
  }

  getTasks() {
    // needs to be specific for staff, query through projects

    this.taskApi.getTasks().subscribe((res) => {
      console.log(res.data);
      this.fetchedTasks = res.data;
      this.taskToEvent(res.data);
    });
  }
  // this function takes in the task data and converts to events on the calendar
  taskToEvent(tasks) {
    const calendarApi = this.calendarComponent['calendar'];
    this.tasks = [];
    tasks.forEach((task) => {
      if (task){
        helper.singleTaskToEvent(task,calendarApi,createEventId)
      }
    });

    this.calendarOptions.events = this.tasks;
    console.log(this.calendarOptions.events);
    
  }

  removeFromDB(id) {
    this.taskApi.deleteTask(id).subscribe((res) => {
      console.log(res);
    });
  }

  dateToString(date) {
    console.log(date);

    return new Date(date).toISOString().replace(/T.*$/, '');
  }

  navigateToTask(taskID) {
    this.router.navigate(['/dashboard/task'], { queryParams: { id: taskID } });
  }
  constructor(
    private api: ApiService,
    private taskApi : TaskService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userType = JSON.parse(localStorage.getItem('userType'));
    if (this.userType.type == 'staff') {
      this.projects = this.userType.projects;
      //this.selectedProject = this.userType.projects[0].id;
    } else if (this.userType.type == 'student') {
      this.studentProject = this.userType.project.project_name;
      this.project_id = this.userType.project_id;
    }
    //console.log(this.userType);

    this.getTasks();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./schedule.component.scss'],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }
  

  onNoClick(): void {
    console.log(this.dialogRef);

    this.dialogRef.close();
  }
}

@Component({
  selector: 'edit-event-dialog',
  templateUrl: './editDialog.html',
})
export class EditEventDialog {
  deleteTask = new EventEmitter();
  viewTask = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('constructor');
  }

  submitUserDelete(): void {
    this.deleteTask.emit({ delete: true });
    this.dialogRef.close();
  }

  submitUserEdit(): void {
    this.viewTask.emit({ view: true });
    this.dialogRef.close();
  }

  onNoClick(): void {
    console.log(this.dialogRef);

    if (confirm(`Are you sure you want to delete the event?`)) {
    }

    this.dialogRef.close();
  }
}

@Component({
  templateUrl: './tooltop.html',
  selector: 'week-number',
})
export class WeekNumber {}
