import { Component, OnInit, Inject } from '@angular/core';
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
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

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
      width : '400px',
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
      
      if (this.title && this.content && this.date && this.task_type && this.status && this.hours_spent) {
        const task = {
          title: result.title,
          content : result.content,
          submission_date: selectInfo.startStr,
          task_due_date: selectInfo.endStr,
          task_type: result.task_type,
          status: result.status,
          hours_spent: result.hours_spent,
          user_id: 3,
        };

        this.api.postTask(task).subscribe((res) => {
          calendarApi.addEvent({
            id: createEventId(),
            title : result.title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay,
            db_id : res.db_id
          });
      })
      }  
    });

    /* */
    //add to view, this is the event that will be checked

    /* 
      }) */
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  getTasks() {
    this.api.getTasks().subscribe((res) => {
      res.data.forEach((task) => {
        const dateString = new Date(task.task_due_date)
          .toISOString()
          .replace(/T.*$/, '');
        console.log(dateString);

        this.tasks.push({
          id: createEventId(),
          title: task.title,
          start: dateString,
          db_id: task.id,
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
  constructor(private api: ApiService, public dialog: MatDialog) {
  }

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
    this.dialogRef.close();
  }
}
