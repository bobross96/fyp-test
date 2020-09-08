import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import 'flatpickr/dist/flatpickr.css'; // you may need to adjust the css import depending on your build tool
import { ApiService } from '../api.service';
import {COLOURS} from '../constants/calendar';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('testContent',{static : true}) testContent : TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  //preload with tasks from db

  events: CalendarEvent[] = [];

  

  activeDayIsOpen: boolean = true;
  tasks: any;
  constructor(private modal: NgbModal, private api : ApiService) {}

  getTasks(){
    return this.api.getTasks().subscribe((res:any) => {
      this.tasks = res.data
      //console.log(this.tasks);
      this.tasks.forEach(task => {
        this.events.push({
          start : new Date(task.submission_date),
          title : task.title,
          color : COLOURS.red,
          actions : this.actions,
          allDay : true,

        })

        console.log(this.events);
        
        
      });
      
    })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'md' });
    this.modal.open(this.testContent, {size : 'lg'})
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: COLOURS.red,
        draggable: false,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        actions : this.actions
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  

  ngOnInit(): void {
    this.getTasks()
  }
}
