import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi  } from '@fullcalendar/angular'; // useful for typechecking
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView : 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventAdd: this.handleEventAdd.bind(this),
    eventRemove : this.handleEventRemove.bind(this)
    
  };

  currentEvents: EventApi[] = [];

  //bool to check for form showing
  showForm = false
  tasks : any = []


  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleEventAdd(addInfo){
    console.log(addInfo.event._def.title);
    
  }

  handleEventRemove(removeInfo){
    console.log(removeInfo.event._def.extendedProps.db_id);
    let db_id = removeInfo.event._def.extendedProps.db_id
    if (db_id){
      this.removeFromDB(db_id)
    }
    
  }
  handleDateSelect(selectInfo: DateSelectArg) {
    
    var newNode = document.createElement('p');
    newNode.textContent = "asdasdasdsa"
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;
    this.showForm = true
    calendarApi.unselect(); // clear date selection

    if (title) {
      const task = {
        title : title,
        submission_date : selectInfo.startStr,
        task_due_date : selectInfo.endStr,
        task_type : "Weekly",
        status : "Anyhow",
        hours_spent : 6,
        user_id : 3
      }

      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });

      this.api.postTask(task).subscribe((res) => {
        console.log(res);
        
      })
       

    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    
    
    
    
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }


  getTasks(){
    this.api.getTasks().subscribe((res) => {
    
      res.data.forEach(task => {
          const dateString = new Date(task.task_due_date).toISOString().replace(/T.*$/, '')
          console.log(dateString);
          
          this.tasks.push({
            id: createEventId(),
            title : task.title,
            start : dateString,
            db_id : task.id
          })
      });
      console.log(this.tasks);
      this.calendarOptions.events = this.tasks
      
    })
  }


  removeFromDB(id){
    this.api.deleteTask(id).subscribe((res)=> {
      console.log(res);
    })

  }
  constructor(private api : ApiService) { }

  ngOnInit(): void {
    this.getTasks()
  }

}
