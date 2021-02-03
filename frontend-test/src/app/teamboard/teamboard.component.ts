import { Component, Inject, OnInit } from '@angular/core';
import {CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormArray, FormGroup, Validators} from '@angular/forms';
import {JobService} from '../services/job.service';
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
@Component({
  selector: 'app-teamboard',
  templateUrl: './teamboard.component.html',
  styleUrls: ['./teamboard.component.scss']
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
  constructor(
    private fb : FormBuilder,
    public dialog: MatDialog,
    private api : JobService,
    private userApi : ApiService) {
    this.boardForm = this.fb.group({
      todo: this.fb.array([]),

      doing: this.fb.array([]),

      done: this.fb.array([]),
    });
   }

  //to be replaced with load from api data
  ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.userType = JSON.parse(localStorage.getItem('userType'));
      console.log(this.userType);
      
      this.userApi.showByProject(this.userType.project_id).subscribe((result) => {
        this.userDict = result.message.reduce((obj,item) => {
          obj[item['id']] = item['first_name']
          return obj
        },{})

        console.log(this.userDict);
        this.api.getJobs(this.userType.project_id).subscribe((result) => {
          let jobs = result.jobs
          jobs.forEach(job => {
            switch (job.status) {
              case 'todo':
                  this.todo.push(
                    this.fb.group({
                      jobDetails: this.fb.control(job.detail),
                      jobBoard: this.fb.control(job.status),
                      jobOwner : this.fb.control(this.userDict[job.user_id]),
                      jobID : this.fb.control(job.id),
                      user_id : this.fb.control(job.user_id)
                    })
                  );
                break;
              case 'doing':
                  this.doing.push(
                    this.fb.group({ 
                      jobDetails: this.fb.control(job.detail),
                      jobBoard: this.fb.control(job.status),
                      jobOwner : this.fb.control(this.userDict[job.user_id]),
                      jobID : this.fb.control(job.id),
                      user_id : this.fb.control(job.user_id)
                    })
                  );
                break;
              case 'done':
                  this.done.push(
                    this.fb.group({ 
                      jobDetails: this.fb.control(job.detail),
                      jobBoard: this.fb.control(job.status),
                      jobOwner : this.fb.control(this.userDict[job.user_id]),
                      jobID : this.fb.control(job.id),
                      user_id : this.fb.control(job.user_id)
                    })
                  );
                break;
              default:
                break;
            }    
            
            
          });
        })
      })
      
        
      
       
  }

  onSubmit(){
    this.boardString = JSON.stringify(this.boardForm.value);
    let scrumBoard = JSON.parse(this.boardString)
    console.log(scrumBoard);
    
    let jobs = []
    for (let board of Object.keys(this.boardForm.value)){
      this.boardForm.value[board].forEach(job => {
        jobs.push({
          id : job.jobID,
          detail : job.jobDetails,
          user_id : job.user_id,
          project_id : this.userType.project_id,
          status : board
        })
      });
    }

    console.log(jobs);
    this.api.storeJobs({jobs : jobs}).subscribe((result) => {
      console.log(result);
      
    })

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

  selectOption(event : Event){
    this.selectedOption = (event.target as HTMLSelectElement).value;
    console.log(this.selectedOption);
    
  }

  openDialog(item, index, boardType) {
    console.log(item);
    let jobOwner = item.value.jobOwner;
    let jobDetails = item.value.jobDetails;
    let jobBoard = boardType;
    let jobID = item.value.jobID
    let user_id = item.value.user_id
    const dialogRef = this.dialog.open(DialogJob, {
      width: '650px',
      data: {
        jobDetails: jobDetails,
        jobBoard: jobBoard,
        jobOwner: jobOwner,
        jobID : jobID
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        item.setValue(
          { jobDetails: result.value.jobDetails, 
            jobOwner: result.value.jobOwner,
            jobBoard : boardType,
            jobID : jobID,
            user_id : user_id });

        //array.push({owner : result.jobOwner})
      }
    });
  }
  

  get todo(){
    return this.boardForm.get('todo') as FormArray
  }

  get doing(){
    return this.boardForm.get('doing') as FormArray
  }
  get done(){
    return this.boardForm.get('done') as FormArray
  }

  deleteControl(event : Event,boardType,index,item){
    event.stopPropagation();
    if (item.value['jobID']){
      this.api.deleteJob(item.value['jobID']).subscribe((result) => {
        console.log(result);
        
      })
    }
    
    
    switch(boardType){
      case "todo":
        this.todo.removeAt(index)
        break;
      case "doing":
        this.doing.removeAt(index)
        break;
      case "done":
        this.done.removeAt(index)
        break;
      default:
        break;
    }
    
  }

  addJob(jobType){
    let owner = this.user['first_name']
    let ownerID = this.user['id']
    switch (jobType) {
      case 'todo':
        this.todo.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard : this.fb.control(jobType),
            jobOwner : this.fb.control(owner),
            jobID : this.fb.control(''),
            user_id : ownerID

          })
        );
        break;
      case 'doing':
        this.doing.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard : this.fb.control(jobType),
            jobOwner : this.fb.control(owner),
            jobID : this.fb.control(''),
            user_id : ownerID
          })
        );
        break;
      case 'done':
        this.done.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard : this.fb.control(jobType),
            jobOwner : this.fb.control(owner),
            jobID : this.fb.control(''),
            user_id : ownerID
          })
        );
        break;
      default:
        break;
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log(event.container.data);
    //update index of formgroup?

    //find the current event container array
    let currentBoard = event.container.id;
    switch (currentBoard) {
      case 'todo':
        this.currentFormArray = this.todo;
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

      switch (currentBoard) {
        case 'todo':
          this.currentFormArray = this.todo;
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

      transferItemInFormArray(
        this.previousFormArray,
        this.currentFormArray,
        event.previousIndex,
        event.currentIndex
      );

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
  dialogForm : FormGroup
  constructor(
    public dialogRef: MatDialogRef<DialogJob>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {
    this.dialogForm = this.fb.group({
      jobDetails : [data.jobDetails,Validators.required],
      jobBoard : [{value : data.jobBoard, disabled : true},Validators.required],
      jobOwner : [data.jobOwner,Validators.required]
    })

  }

  delete(){
    alert('pretend this works')
  }

  
  save(){
    if (this.dialogForm.valid){
      console.log(this.dialogForm);
      this.dialogRef.close(this.dialogForm);
    }

    else {
      alert(this.dialogForm.valid)
    }
  }

  onNoClick(): void {
    console.log(this.dialogRef);

    this.dialogRef.close();
  }
}

