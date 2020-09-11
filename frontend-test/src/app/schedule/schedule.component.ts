import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  DayHeader,
  DayCellContent,
} from '@fullcalendar/angular'; // useful for typechecking
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { ApiService } from '../api.service';
import {
  ComponentPortal,
  DomPortal,
  Portal,
  TemplatePortal,
} from '@angular/cdk/portal';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from 'rxjs';

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
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
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
    eventDisplay: 'block',

    // trying to add button to days with events
    /* dayCellContent : function(arg)
    {

      let italic = document.createElement('div')
      let testString = '<button type="button" class="btn btn-primary" (click)="poop()">Menu</button>'
      
      
      
      console.log(arg);
      
      //italic.innerHTML = 'asdasd'
      if (arg){
        italic.innerHTML = testString
      }

      else {
        italic.innerHTML = ''
      }
      return {domNodes : [italic]}} */
  };

  currentEvents: EventApi[] = [];

  //bool to check for form showing
  showForm = false;
  tasks: any = [];

  poop() {
    console.log('poop!');
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleEventAdd(addInfo) {
    console.log(addInfo.event._def.title);
  }

  handleEventRemove(removeInfo) {
    console.log(removeInfo.event);
    let db_id = removeInfo.event._def.extendedProps.db_id;
    if (db_id) {
      this.removeFromDB(db_id);
    }
  }
  delete = false
  title: string;
  content: string;
  status: string;
  task_type: string;
  date: Date;
  hours_spent: number;
  handleDateSelect(selectInfo: DateSelectArg) {
    //const title = prompt('Please enter a new title for your event');
    // const content = prompt('Content')
    const calendarApi = selectInfo.view.calendar;
    this.showForm = true;
    calendarApi.unselect(); // clear date selection

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: {
        title: this.title,
        content: this.content,
        status: this.status,
        date: this.date,
        hours_spent: this.hours_spent,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      //insert post request here
      console.log(result);
      //console.log(this.title);

      if (
        result.title &&
        result.content &&
        result.date &&
        result.task_type &&
        result.status &&
        result.hours_spent
      ) {
        const task = {
          title: result.title,
          content: result.content,
          submission_date: result.date,
          task_due_date: result.date,
          task_type: result.task_type,
          status: result.status,
          hours_spent: result.hours_spent,
          user_id: 3,
        };
        console.log(task);

        this.api.postTask(task).subscribe((res) => {
          console.log(res);
          let date = new Date(result.date);
          console.log(date);
          console.log(selectInfo.startStr);

          calendarApi.addEvent({
            id: createEventId(),
            title: result.title,
            start: date,
            allDay: selectInfo.allDay,
            db_id: res.db_id,
          });
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
    let toDelete = false
    const dialogRef = this.dialog.open(EditEventDialog, {
      data: {
        title: clickInfo.event._def.title,
        delete: false,
      },
    });

    const subscribeDialog = dialogRef.componentInstance.deleteTask.subscribe((data) => {
      console.log('dialog data', data);
      if (data.delete){
        toDelete = true
      }
    })
    
    dialogRef.afterClosed().subscribe((result) => {
      subscribeDialog.unsubscribe();
      console.log('dialogue log was closed');
      if (toDelete) {
        console.log(clickInfo.event);
        
        clickInfo.event.remove()
        //delete from db as well
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  getTasks() {
    this.api.getTasks().subscribe((res) => {
      res.data.forEach((task) => {
        console.log(task.task_due_date);
        let color = '#3788d8';
        const dateString = task.task_due_date.toString();
        switch (task.task_type) {
          case 'final':
            color = 'red';
            break;
          case 'completed':
            color = 'green';
          default:
            break;
        }
        console.log(dateString);

        this.tasks.push({
          id: createEventId(),
          title: task.title,
          start: dateString,
          db_id: task.id,
          color: color,
        });
      });
      console.log(this.tasks);
      this.calendarOptions.events = this.tasks;
    });
  }

  removeFromDB(id) {
    this.api.deleteTask(id).subscribe((res) => {
      console.log(res);
    });
  }

  dateToString(date) {
    console.log(date);

    return new Date(date).toISOString().replace(/T.*$/, '');
  }
  constructor(private api: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTasks();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('constructor');
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
 
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('constructor');
  }

  submitUserDelete():void {
    this.deleteTask.emit({delete : true})
    this.dialogRef.close()
  }

  onNoClick(): void {
    console.log(this.dialogRef);

    if (
      confirm(
        `Are you sure you want to delete the event?`
      )
    ) {
      
    }

    

    this.dialogRef.close();
  }
}
