import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { TaskService } from '../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as helper from '../functions/helper';

@Component({
  selector: 'app-task-all',
  templateUrl: './task-all.component.html',
  styleUrls: ['./task-all.component.scss'],
})
export class TaskAllComponent implements OnInit {
  userInfo: any;
  sem1Start: any;
  sem2Start: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private taskApi: TaskService
  ) {}
  tasks: any;
  panelOpenState = false;
  taskType: any;
  selectedProject: any;

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.sem1Start = this.userInfo.projectInfo.sem_1_start_date;
    this.sem2Start = this.userInfo.projectInfo.sem_2_start_date;

    //this is for staff view
    this.route.queryParams.subscribe((queries) => {
      console.log(queries);
      switch (queries.taskType) {
        case 'weeklyReports':
          this.taskType = 'Weekly Report';
          break;
        case 'meetingNotes':
          this.taskType = 'Meeting Notes';
          break;
        default:
          this.taskType = null;
          break;
      }
      this.tasks = [];

      if (this.userInfo.user.userType == 'staff') {
        //only when project change happens, refetch everything
        this.api.currentProject.subscribe((projectID) => {
          this.selectedProject = projectID;
          if (this.selectedProject) {
            this.taskApi
              .getTasksByProjectId(this.selectedProject)
              .subscribe((tasks) => {
                this.tasks = tasks.data;
                //filter out tasks that are same to the page url
                this.filterTasks(this.sem1Start, this.sem2Start);
              });
          }

          //this case runs when no project is selected
          else {
            this.selectedProject = this.userInfo.projectInfo[0].id;
            this.api.changeProject(this.selectedProject);
          }
        });
      } else if (this.userInfo.user.userType == 'student') {
        this.selectedProject = this.userInfo.projectInfo.id;
        this.taskApi
          .getTasksByProjectId(this.selectedProject)
          .subscribe((tasks) => {
            this.tasks = tasks.data;

            this.filterTasks(this.sem1Start, this.sem2Start);
          });
      }
    });
  }

  taskView(id) {
    this.router.navigateByUrl('/dashboard/task?id=' + id);
  }

  //implemented in the html
  getTaskColour(taskType) {
    let color = 'grey';
    switch (taskType) {
      case 'Pending':
        color = 'blue';
        break;
      case 'Completed':
        color = 'green';
        break;
      case 'Late':
        color = 'red';
        break;
      default:
        color = 'grey';
        break;
    }

    return color;
  }

  filterTasks(sem1Start, sem2Start) {
    this.tasks = this.tasks.filter((task) => {
      if (this.taskType) {
        return task.task_type == this.taskType;
      } else {
        return (
          task.task_type != 'Weekly Report' && task.task_type != 'Meeting Notes'
        );
      }
    });

    this.tasks.forEach((task) => {
      if (task.task_due_date) {
        task.weekNumber = helper.getWeekForTasks(
          task.task_due_date,
          sem1Start,
          sem2Start
        );
        task.task_due_date = task.task_due_date.substring(0, 10);
      }
      if (task.submission_date) {
        task.submission_date = task.submission_date.substring(0, 10);
      }
    });
  }
}
