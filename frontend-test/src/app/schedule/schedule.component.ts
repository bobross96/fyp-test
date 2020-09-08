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
    
    
  };

  currentEvents: EventApi[] = [];

  tasks : any = []
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

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
          const dateString = new Date(task.submission_date).toISOString().replace(/T.*$/, '')
          console.log(dateString);
          
          this.tasks.push({
            id: createEventId(),
            title : task.title,
            start : new Date(task.submission_date).toISOString().replace(/T.*$/, '')
          })
      });
      console.log(this.tasks);
      this.calendarOptions.events = this.tasks
      
    })
  }
  constructor(private api : ApiService) { }

  ngOnInit(): void {
    this.getTasks()
  }

}
