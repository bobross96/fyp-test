import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { JobService } from '../services/job.service';
import { ChartComponent } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

import { User } from '../User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  users: User[];
  userInfo: any;
  projectID: number;
  jobs: any[];
  todo: any[] = [];
  doing: any[] = [];
  done: any[] = [];
  archived: any[] = [];
  isStudent: boolean = true;
  staffProjects: any;
  totalHours: number;
  userDict: any;
  userHours: any;
  projectDetails : any;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private api: ApiService, private jobApi: JobService) {
    this.projectID = JSON.parse(localStorage.getItem('selectedProject'));
    console.log(this.projectID);

    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  async ngOnInit(): Promise<void> {
    //display own user data
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (this.userInfo.user.userType == 'staff') {
      console.log(this.userInfo);
      this.api.currentProject.subscribe(async (projectID) => {
        this.projectID = projectID;
        //call all jobs from the project
        const jobs = await this.jobApi.fetchJobs(this.projectID);
        //get array of students per project
        const body = await this.api.fetchByProject(this.projectID);

        this.api.getProjectByID(this.projectID).subscribe((res) => {
          console.log(res);
          this.projectDetails = res
        })


        this.userDict = body.message.reduce((obj, item) => {
          obj[item['id']] = item['first_name'];
          return obj;
        });

        this.userHours = jobs.jobs.reduce((obj, item) => {
          if (obj[item['user_id']]) {
            obj[item['user_id']] += item.hours_spent;
          } else {
            obj[item['user_id']] = item.hours_spent;
          }

          return obj;
        }, {});

        let series = []
        let labels = []
        console.log(this.userHours);
        
        for (let user in this.userHours){
          series.push(this.userHours[user])
          labels.push(this.userDict[user])
        }

        //populate the chart
        this.chartOptions.series = series
        this.chartOptions.labels = labels
      });
      //fetch the project and get the hours of the students and put in pie chart
      //refetch whenever the data change

      this.isStudent = false;
      this.staffProjects = this.userInfo.projectInfo;
      console.log(this.staffProjects);
    }

    this.jobApi.getJobsByUserID(this.userInfo.user.id).subscribe((res: any) => {
      console.log(res);
      this.jobs = res.jobs;
      this.jobs.forEach((job) => {
        switch (job.status) {
          case 'todo':
            this.todo.push(job);
            break;
          case 'doing':
            this.doing.push(job);
            break;
          case 'done':
            this.done.push(job);
            break;
          case 'archived':
            this.archived.push(job);
          default:
            break;
        }
      });

      //get total hours
      this.totalHours = this.jobs.reduce((acc, curr) => {
        return acc + curr.hours_spent;
      }, 0);

      console.log(this.totalHours);
    });
    //gets all users tagged to the project
    this.api.showByProject(this.projectID).subscribe((res: any) => {
      console.log(res);
      this.users = res.message;
    });
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
