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
  fileToUpload: any;
  fileFromDB: any;
  uploadedFile: any;

  constructor(public router : Router,
              private route : ActivatedRoute, 
              private api : ApiService,
              public dialog : MatDialog) { }
  task : any
  pdfSrc : any
  
  ngOnInit(): void {

    let taskID = parseInt(this.route.snapshot.queryParamMap.get('id'))
    console.log(taskID);
    
    
    this.api.getTaskById(taskID).subscribe((res)=> {
      this.task = res.task
      this.fileFromDB = res.file[0].document.data
      
      
      
      


      console.log(res);
      if (this.task.submission_date){
      this.task.submission_date = this.task.submission_date.substring(0,10)
      }
      this.task.task_due_date = this.task.task_due_date.substring(0,10)
      
      
      
      
    })
    //take the id from the url and get the task?
    
    
  }

  poop(){
    console.log('poop');
    
  }
  showFile(){
    this.api.getDocument(this.task.id).subscribe((res) => {      
      this.fileFromDB = new Blob([res],{type:"application/pdf"})
      this.uploadedFile = this.fileFromDB
      console.log(this.fileFromDB);
      let reader = new FileReader()
      
        reader.onload = (e:any) => {
          
          
          this.pdfSrc = e.target.result;
          console.log(this.pdfSrc);
        }
        
        reader.readAsArrayBuffer(this.fileFromDB) 
      
      /* let fileUrl = URL.createObjectURL(this.fileFromDB)
      const iframe = document.getElementById('pdfTest')
      iframe.setAttribute('src',fileUrl)
      URL.revokeObjectURL(fileUrl)  */
    })


    /* blob attempt
    this.fileFromDB = new Blob([this.fileFromDB],{type:"application/pdf"})
    console.log(this.fileFromDB);
    
    let fileUrl = URL.createObjectURL(this.fileFromDB)
    const iframe = document.getElementById('pdfTest')
    iframe.setAttribute('src',fileUrl)
    URL.revokeObjectURL(fileUrl)  */
    
    /* let reader = new FileReader()
      
        reader.onload = (e:any) => {
          
          
          this.pdfSrc = e.target.result;
          console.log(this.pdfSrc);
        }
        
        reader.readAsArrayBuffer(fileUrl)   */
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
    if (this.task.submission_date){
    this.task.submission_date = this.task.submission_date.substring(0,10)
    }
    this.task.task_due_date = this.task.task_due_date.substring(0,10)
  }


  postFile(files : FileList){
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    let reader = new FileReader()
    reader.onload = (e:any) => {
      this.pdfSrc = e.target.result;
      console.log(this.pdfSrc);
      
    }
    reader.readAsArrayBuffer(this.fileToUpload)
    

  }

  uploadFile(){
    if(!this.fileToUpload){
      alert('no file uploaded')
      return;
    }
    else {
      let formData = new FormData();
      formData.append('file',this.fileToUpload,this.fileToUpload.name);
      this.api.postDocument(formData,this.task.id).subscribe((res) => {
        console.log(res);
        alert('successfully uploaded!')
      })
    }
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