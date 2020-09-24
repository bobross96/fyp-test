import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(public router : Router,
              private route : ActivatedRoute, 
              private api : ApiService,
              public dialog : MatDialog) { }
  task : any
  
  ngOnInit(): void {

    let taskID = parseInt(this.route.snapshot.queryParamMap.get('id'))
    console.log(taskID);
    
    
    this.api.getTaskById(taskID).subscribe((res)=> {
      this.task = res.task
      console.log(res);
      if (this.task.submission_date){
      this.task.submission_date = this.task.submission_date.substring(0,10)
      }
      this.task.task_due_date = this.task.task_due_date.substring(0,10)
      
      
      
      
    })
    //take the id from the url and get the task?
    
    
  }

  editTask(){
    const dialogRef = this.dialog.open(DialogEdit, {
      width : '600px',
      data : {
        task_type : this.task.task_type,
        title : this.task.title,
        content : this.task.content,
        hours_spent : this.task.hours_spent

      }
    })
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (!result){
        return
      }
      else if (result.title &&
        result.content &&
        result.hours_spent){
          console.log('poop');
          
          this.api.editTask(this.task.id,result).subscribe((res) => {
            this.task = res.task
            this.changeDateForm()
          })
        }
      else {
        alert('task not edited due to missing fields')
      }
     
    })
  }

  submitTask(){
    this.task.submission_date = new Date()
    this.api.submitTask(this.task.id,this.task).subscribe((res) => {
      alert('task successfully submitted!')
      this.task = res.task
      this.changeDateForm()
      
    })
  }

  getTask(id:number){
    //will get the task?
  }

  changeDateForm(){
    /* if (this.task.submission_date){
    this.task.submission_date = this.task.submission_date.substring(0,10)
    } */
    this.task.task_due_date = this.task.task_due_date.substring(0,10)
  }

}

@Component({
  selector : 'dialog-edit',
  templateUrl : './dialogEdit.html'
})
export class DialogEdit {
  constructor(
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('constructor');
  }
    
  
}