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
  thisSem = 1
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
    weekNumbers: true,
    weekText: `Sem 1 Week `,
    contentHeight: 'auto',
    weekNumberContent: function (arg) {
      if (!arg.num || arg.num < 0 || arg.num > 14) {
        arg.text = '';
      } else if (arg.num == 8) {
        arg.text = 'Recess Week';
      } else if (arg.num > 8) {
        arg.text = `Sem 1 Week ${arg.num - 1}`;
      }
    },
    weekNumberCalculation: function (local) {
      let startDate = new Date('8/11/2020');
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
  fetchedTasks : any = []
  user : any
  userType : any;
  projects : any;
  project_id: any;
  // follows value from html page
  selectedProject 
  studentProject: any;
  /* projectForm = this.fb.group([

  ]) */



  

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
  delete = false;
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
    console.log(selectInfo);
    this.date = new Date(selectInfo.startStr)
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: {
        task_type : this.task_type,
        date: this.date,
        
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      //insert post request here
      console.log(result);
      //console.log(this.title);
      if (!result){
        return
      }
      else if (result.date &&result.task_type){
        console.log(this.userType);
        
        if(this.userType.type == 'staff'){
          if (!this.selectedProject){
            alert('please select a project!')
            return
            
          }
          this.project_id = this.selectedProject
        }

        else if(this.userType.type == 'student'){
          this.project_id = this.userType.project_id
        }
        
        
        const task = {
          task_due_date: result.date,
          task_type: result.task_type,
          status: "Pending",
          user_id: this.user.id,
          project_id : this.project_id
        };
        console.log(task);

        this.api.postTask(task).subscribe((res) => {
          console.log(res);
          let date = new Date(result.date);
      
          calendarApi.addEvent({
            id: createEventId(),
            title: result.task_type,
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
    let toDelete = false;
    let toView = false
    let task = {}
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

    const viewTask = dialogRef.componentInstance.viewTask.subscribe(
      (data) => {
        if (data.view){
          console.log(clickInfo.event._def);
          toView = true
        }
      }
    )



    dialogRef.afterClosed().subscribe((result) => {
      subscribeDialog.unsubscribe();
      console.log('dialogue log was closed');
      if (toDelete) {
        console.log(clickInfo.event);

        clickInfo.event.remove();
        //delete from db as well
      }

      else if (toView){
        this.navigateToTask(clickInfo.event._def.extendedProps.db_id)
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  changeProject() {
    this.project_id = this.selectedProject
    console.log(this.selectedProject);
    
    this.getTasksForStaff()
  }

  getTasksForStaff(){ 
    //clears the calendar
    this.calendarOptions.events = []
    
    const filteredTasks = this.fetchedTasks.filter(task => task.project_id == this.selectedProject)

    
    this.taskToEvent(filteredTasks)
    
    
    //set tasks based on project id chosen
    console.log(this.userType);
    
    
    // fetch depending on the id of project
  }


  getTasks() {
    // needs to be specific for staff, query through projects
    
    this.api.getTasks().subscribe((res) => {
      console.log(res.data);
      this.fetchedTasks = res.data
      this.taskToEvent(res.data)
      
    });
  }
  // this function takes in the task data and converts to events on the calendar
  taskToEvent(tasks){
    this.tasks = []
    tasks.forEach((task) => {
      
      if (task){
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
      

      this.tasks.push({
        id: createEventId(),
        title: task.title,
        start: dateString,
        db_id: task.id,
        color: color,
      });
    }
    });
  
    
    this.calendarOptions.events = this.tasks;
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


  navigateToTask(taskID){
    this.router.navigate(['/dashboard/task'], { queryParams: { id: taskID }});
  }
  constructor(private api: ApiService, 
              public dialog: MatDialog,
              private fb : FormBuilder,
              private router : Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.userType = JSON.parse(localStorage.getItem('userType'))
    if (this.userType.type == 'staff'){
      this.projects = this.userType.projects
    }

    else if (this.userType.type == 'student'){
      this.studentProject = this.userType.project.project_name
    }
    console.log(this.userType);
    
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

  submitUserEdit():void {
    this.viewTask.emit({ view : true})
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
