import { Component, Inject, OnInit, NgZone, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import {
  CdkDragDrop,
  CdkDragStart,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../services/job.service';
import {
  moveItemInFormArray,
  transferItemInFormArray,
} from './move-item-helper';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CanDeactivate } from '@angular/router';
@Component({
  selector: 'app-teamboard',
  templateUrl: './teamboard.component.html',
  styleUrls: ['./teamboard.component.scss'],
})
export class TeamboardComponent implements OnInit {
  faTimesCircle = faTimesCircle;
  user: object;
  boardForm: any;
  boardString: string;
  jobDetails: string;
  jobOwner: string;
  jobBoard: string;
  boardData: {
    todo: [];
    doing: [];
    done: [];
  };
  currentFormArray: FormArray;
  previousFormArray: FormArray;
  dragging: boolean;
  selectedOption: string;
  userType: any;
  userDict: any;
  userInfo: any;
  projectID: number;
  related_id = [];
  notifBody: any;
  //the people assigned to a specific project
  groupMates: any[];
  userArray: any;
  reverseUserDict: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private jobApi: JobService,
    private api: ApiService,
    private userApi: ApiService,
    private notifService: NotificationService,
    private snackBar: MatSnackBar,
    private moveBar: MatSnackBar
  ) {
    this.boardForm = this.fb.group({
      todo: this.fb.array([]),

      doing: this.fb.array([]),

      done: this.fb.array([]),
    });
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  openSnackBar() {
    this.snackBar.open('Board Updated', 'Close', {
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  moveJobBar() {
    this.moveBar.open('Job Moved', 'Close', {
      duration: 1000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  //to be replaced with load from api data
  async ngOnInit(): Promise<void> {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    //add for staff
    this.projectID = JSON.parse(localStorage.getItem('selectedProject'));
    console.log(this.projectID);

    if (this.userInfo.user.userType == 'staff') {
      this.api.currentProject.subscribe(async (projectID) => {
        this.projectID = projectID;
        //need to refetch data as projectID has changed
        let userFetch = await this.userApi.fetchByProject(this.projectID);
        this.userArray = userFetch.message;
        this.userDict = userFetch.message.reduce((obj, item) => {
          obj[item['id']] = item['first_name'];
          return obj;
        }, {});

        this.reverseUserDict = userFetch.message.reduce((obj, item) => {
          obj[item['first_name']] = item['id'];
          return obj;
        }, {});

        let jobsFetch = await this.jobApi.fetchJobs(this.projectID);
        let jobs = jobsFetch.jobs;
        this.todo.clear();
        this.doing.clear();
        this.done.clear();

        jobs.forEach((job) => {
          switch (job.status) {
            case 'todo':
              this.todo.push(
                this.fb.group({
                  jobDetails: this.fb.control(job.detail),
                  jobBoard: this.fb.control(job.status),
                  jobOwner: this.fb.control(this.userDict[job.user_id]),
                  jobID: this.fb.control(job.id),
                  jobHours: this.fb.control(job.hours_spent),
                  user_id: this.fb.control(job.user_id),
                })
              );
              break;
            case 'doing':
              this.doing.push(
                this.fb.group({
                  jobDetails: this.fb.control(job.detail),
                  jobBoard: this.fb.control(job.status),
                  jobOwner: this.fb.control(this.userDict[job.user_id]),
                  jobID: this.fb.control(job.id),
                  jobHours: this.fb.control(job.hours_spent),
                  user_id: this.fb.control(job.user_id),
                })
              );
              break;
            case 'done':
              this.done.push(
                this.fb.group({
                  jobDetails: this.fb.control(job.detail),
                  jobBoard: this.fb.control(job.status),
                  jobOwner: this.fb.control(this.userDict[job.user_id]),
                  jobID: this.fb.control(job.id),
                  jobHours: this.fb.control(job.hours_spent),
                  user_id: this.fb.control(job.user_id),
                })
              );
              break;
            default:
              break;
          }
        });
      });
    } else if (this.userInfo.user.userType == 'student') {
      let userFetch = await this.userApi.fetchByProject(this.projectID);
      this.userDict = userFetch.message.reduce((obj, item) => {
        obj[item['id']] = item['first_name'];
        return obj;
      }, {});
      this.reverseUserDict = userFetch.message.reduce((obj, item) => {
        obj[item['first_name']] = item['id'];
        return obj;
      }, {});
      this.userArray = userFetch.message;

      console.log(this.userDict);

      this.jobApi.getJobs(this.projectID).subscribe((result) => {
        let jobs = result.jobs;
        jobs.forEach((job) => {
          switch (job.status) {
            case 'todo':
              this.todo.push(
                this.fb.group({
                  jobDetails: this.fb.control(job.detail),
                  jobBoard: this.fb.control(job.status),
                  jobOwner: this.fb.control(this.userDict[job.user_id]),
                  jobID: this.fb.control(job.id),
                  jobHours: this.fb.control(job.hours_spent),
                  user_id: this.fb.control(job.user_id),
                })
              );
              break;
            case 'doing':
              this.doing.push(
                this.fb.group({
                  jobDetails: this.fb.control(job.detail),
                  jobBoard: this.fb.control(job.status),
                  jobOwner: this.fb.control(this.userDict[job.user_id]),
                  jobID: this.fb.control(job.id),
                  jobHours: this.fb.control(job.hours_spent),
                  user_id: this.fb.control(job.user_id),
                })
              );
              break;
            case 'done':
              this.done.push(
                this.fb.group({
                  jobDetails: this.fb.control(job.detail),
                  jobBoard: this.fb.control(job.status),
                  jobOwner: this.fb.control(this.userDict[job.user_id]),
                  jobID: this.fb.control(job.id),
                  jobHours: this.fb.control(job.hours_spent),
                  user_id: this.fb.control(job.user_id),
                })
              );
              break;
            default:
              break;
          }
        });
      });
    }
  }

  onSubmit() {
    this.boardString = JSON.stringify(this.boardForm.value);
    let scrumBoard = JSON.parse(this.boardString);
    console.log(scrumBoard);

    let jobs = [];
    for (let board of Object.keys(this.boardForm.value)) {
      this.boardForm.value[board].forEach((job) => {
        jobs.push({
          id: job.jobID,
          detail: job.jobDetails,
          user_id: job.user_id,
          project_id: this.projectID,
          status: board,
          hours_spent: job.jobHours,
        });
      });
    }

    console.log(jobs);
    this.jobApi.storeJobs({ jobs: jobs }).subscribe((result) => {
      console.log(result);
    });

    this.notifBody = {
      title: 'Teamboard updated',
      description: '',
      source_user_id: this.userInfo.user.id,
      is_read: false,
      event_id: '',
      event_type: 'teamboard',
    };

    this.notifService
      .postNotifByProjectID(this.projectID, this.notifBody)
      .subscribe((res) => {
        (err) => console.log(err);
        (res) => console.log(res);
      });
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  handleClick(event: MouseEvent, item, index, boardType): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }

    this.openDialog(item, index, boardType);
  }

  selectOption(event: Event) {
    this.selectedOption = (event.target as HTMLSelectElement).value;
    console.log(this.selectedOption);
  }

  //fired when box is clicked
  openDialog(item, index, boardType) {
    console.log(item);
    let jobOwner = item.value.jobOwner;
    let jobDetails = item.value.jobDetails;
    let jobBoard = boardType;
    let jobID = item.value.jobID;
    let jobHours = item.value.jobHours;
    let user_id = item.value.user_id;
    let userArray = this.userArray;
    const dialogRef = this.dialog.open(DialogJob, {
      width: '800px',
      data: {
        jobDetails: jobDetails,
        jobBoard: jobBoard,
        jobOwner: jobOwner,
        jobID: jobID,
        jobHours: jobHours,
        user_id: user_id,
        userArray: userArray,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result == 'delete') {
        this.deleteControl(null, boardType, index, item);
      } else if (result) {
        if (result.value.jobBoard == 'archived') {
          if (!this.userInfo.user.is_admin) {
            alert('Non-admin not allowed to archive!');
            return;
          }

          var conf = confirm('Confirm Archive?');
          if (conf) {
            var job = [
              {
                id: jobID,
                detail: result.value.jobDetails,
                user_id: this.reverseUserDict[result.value.jobOwner],
                project_id: this.projectID,
                hours_spent: result.value.jobHours,
                status: 'archived',
              },
            ];

            this.jobApi.storeJobs({ jobs: job }).subscribe((result) => {
              console.log(result);
            });

            this.done.removeAt(index);
          }
          //this is normal updating
        } else {
          item.setValue({
            jobDetails: result.value.jobDetails,
            jobOwner: result.value.jobOwner,
            jobBoard: boardType,
            jobID: jobID,
            jobHours: result.value.jobHours,
            user_id: this.reverseUserDict[result.value.jobOwner],
          });

          //add code to update API for this job here

          if (jobID) {
            const jobBody = {
              detail: result.value.jobDetails,
              user_id: this.reverseUserDict[result.value.jobOwner],
              status: boardType,
              project_id: this.projectID,
              hours_spent: result.value.jobHours,
              id: jobID,
            };
            const response = await this.jobApi.storeOneJob(jobBody);
            if (response) {
              alert('job updated!');
            }
          } else {
            const jobBody = {
              detail: result.value.jobDetails,
              user_id: this.reverseUserDict[result.value.jobOwner],
              status: boardType,
              project_id: this.projectID,
              hours_spent: result.value.jobHours,
            };
            const response = await this.jobApi.storeOneJob(jobBody);
            if (response.id) {
              item.setValue({
                jobDetails: result.value.jobDetails,
                jobOwner: result.value.jobOwner,
                jobBoard: boardType,
                jobID: response.id,
                jobHours: result.value.jobHours,
                user_id: this.reverseUserDict[result.value.jobOwner],
              });
              alert('job created!');
            }
          }
        }
      }
    });
  }

  get todo() {
    return this.boardForm.get('todo') as FormArray;
  }

  get doing() {
    return this.boardForm.get('doing') as FormArray;
  }
  get done() {
    return this.boardForm.get('done') as FormArray;
  }

  //to do for readability
  archiveControl(event: Event, boardType, index, item) {
    if (!this.userInfo.user.is_admin) {
      alert('Non-admin not allowed to archive!');
      return;
    }

    var conf = confirm('Confirm Archive?');
    if (conf) {
      if (item.value['jobID']) {
        this.jobApi.deleteJob(item.value['jobID']).subscribe((result) => {
          console.log(result);
          alert('successfully archived');
        });
      }

      switch (boardType) {
        case 'todo':
          this.todo.removeAt(index);
          break;
        case 'doing':
          this.doing.removeAt(index);
          break;
        case 'done':
          this.done.removeAt(index);
          break;
        default:
          break;
      }
    }
  }

  deleteControl(event: Event, boardType, index, item) {
    if (event) {
      event.stopPropagation();
    }

    if (!this.userInfo.user.is_admin) {
      alert('Non-admin not allowed to delete!');
      return;
    }

    var conf = confirm('Confirm Delete?');
    if (conf) {
      alert('successfully deleted');
      if (item.value['jobID']) {
        this.jobApi.deleteJob(item.value['jobID']).subscribe((result) => {
          console.log(result);
        });
      }

      switch (boardType) {
        case 'todo':
          this.todo.removeAt(index);
          break;
        case 'doing':
          this.doing.removeAt(index);
          break;
        case 'done':
          this.done.removeAt(index);
          break;
        default:
          break;
      }
    }
  }

  //control what happens when user click on addjob
  addJob(jobType) {
    let owner = this.userInfo.user['first_name'];
    let ownerID = this.userInfo.user['id'];
    switch (jobType) {
      case 'todo':
        this.todo.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard: this.fb.control(jobType),
            jobOwner: this.fb.control(owner),
            jobID: this.fb.control(''),
            jobHours: this.fb.control(0),
            user_id: ownerID,
          })
        );
        console.log(this.todo.length);



        this.openDialog(
          this.todo.at(this.todo.length - 1),
          this.todo.length - 1,
          jobType
        );
        break;
      case 'doing':
        this.doing.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard: this.fb.control(jobType),
            jobOwner: this.fb.control(owner),
            jobID: this.fb.control(''),
            jobHours: this.fb.control(0),
            user_id: ownerID,
          })
        );
        this.openDialog(
          this.doing.at(this.doing.length - 1),
          this.doing.length - 1,
          jobType
        );
        break;
      case 'done':
        this.done.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard: this.fb.control(jobType),
            jobOwner: this.fb.control(owner),
            jobID: this.fb.control(''),
            jobHours: this.fb.control(0),
            user_id: ownerID,
          })
        );
        this.openDialog(
          this.done.at(this.done.length - 1),
          this.done.length - 1,
          jobType
        );
        break;
      default:
        break;
    }
  }

  async drop(event: CdkDragDrop<string[]>) {
    

    //find the current event container array
    let currentBoard = event.container.id;
    switch (currentBoard) {
      case 'todo':
        this.currentFormArray = this.todo;
        //add code to update status here

        break;
      case 'doing':
        this.currentFormArray = this.doing;
        break;
      case 'done':
        this.currentFormArray = this.done;
        break;
      default:
        break;
    }

    if (event.previousContainer === event.container) {
      moveItemInFormArray(
        this.currentFormArray,
        event.previousIndex,
        event.currentIndex
      );
      console.log(this.boardForm);
    } else {
      //transfer between boards, update db.
      let previousBoard = event.previousContainer.id;
      switch (previousBoard) {
        case 'todo':
          this.previousFormArray = this.todo;
          break;
        case 'doing':
          this.previousFormArray = this.doing;
          break;
        case 'done':
          this.previousFormArray = this.done;
          break;
        default:
          break;
      }

      let body = {}
      switch (currentBoard) {
        case 'todo':
          this.currentFormArray = this.todo;
          body = {
            status : 'todo'
          }
          break;
        case 'doing':
          this.currentFormArray = this.doing;
          body = {
            status : 'doing'
          }
          break;
        case 'done':
          this.currentFormArray = this.done;
          body = {
            status : 'done'
          }
          break;
        default:
          break;
      }

      console.log(this.previousFormArray.value[event.previousIndex]);
      let id = this.previousFormArray.value[event.previousIndex].jobID

      transferItemInFormArray(
        this.previousFormArray,
        this.currentFormArray,
        event.previousIndex,
        event.currentIndex
      );

    
      
      //code to transfer that data over , params is in terms of board!
      let response = await this.jobApi.moveJob(id,body)
      if (response){
        this.moveJobBar();
      }

      

      console.log(this.boardForm);

      //remove formgroup from previous board at previousIndex

      //add formgroup to current board at the currentIndex
    }
  }
}

@Component({
  selector: 'dialog-job',
  templateUrl: './dialogJob.html',
  styleUrls: ['./teamboard.component.scss'],
})
export class DialogJob {
  dialogForm: FormGroup;
  userArray: any[];
  jobOwner: any;
  isDone: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogJob>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _ngZone: NgZone
  ) {
    this.dialogForm = this.fb.group({
      jobDetails: [data.jobDetails, Validators.required],
      jobBoard: [data.jobBoard, Validators.required],
      jobOwner: [data.jobOwner, Validators.required],
      jobHours: [data.jobHours, Validators.required],
    });

    this.userArray = data.userArray;
    this.jobOwner = data.jobOwner;
    if (data.jobBoard == 'done') {
      this.isDone = true;
    }
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  delete() {
    this.dialogRef.close('delete');
  }

  save() {
    if (this.dialogForm.valid) {
      console.log(this.dialogForm);
      this.dialogRef.close(this.dialogForm);
    } else {
      alert(this.dialogForm.valid);
    }
  }

  archive() {
    //will update status of job board to archive, patch to backend
    //delete the job from the list
    if (this.dialogForm.valid) {
      this.dialogForm.patchValue({ jobBoard: 'archived' });
      this.dialogRef.close(this.dialogForm);
    } else {
      alert(this.dialogForm.valid);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
