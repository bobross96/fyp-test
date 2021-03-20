import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import {TaskService} from '../services/task.service';
import { DocumentService } from "../services/document.service";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { NotificationService } from '../services/notification.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  fileToUpload: any;
  fileFromDB: any;
  uploadedFile: any;
  pageVariable: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private taskApi : TaskService,
    private documentApi : DocumentService, 
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private notifService : NotificationService
  ) {}
  task: any;
  pdfSrc: any;
  attachments: any = [];
  related_id = []
  notifBody : any
  selectedProject : number
  taskID : any

  ngOnInit(): void {
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject'))
    //on any change of current project, it will update selectedproject accordingly
    this.api.currentProject.subscribe(projectID => {
      console.log('task component still alive');
      this.selectedProject = projectID
    })

    //just detects changes
    this.route.queryParams.subscribe(params => {
      this.taskID = this.route.snapshot.queryParamMap.get('id')
      this.notifBody = {
        title : "Task Submitted",
        description : "",
        source_user_id : userInfo.user.id,
        is_read : false,
        event_id : this.taskID,
        event_type : "task"
      }
  
  
  
      // gets the task object
      this.taskApi.getTaskById(this.taskID).subscribe((res) => {
        this.task = res.task;
        console.log(res);
        if (this.task.submission_date) {
          this.task.submission_date = this.task.submission_date.substring(0, 10);
        }
        this.task.task_due_date = this.task.task_due_date.substring(0, 10);
      });
      // gets the document realted to the task and inputting into an array
  
      this.documentApi.getDocument(this.taskID).subscribe((res) => {
        this.attachments = res;
      });
      
    })

   
  }

  nextPage() {
    this.pageVariable++;
  }

  previousPage() {
    if (this.pageVariable != 0) {
      this.pageVariable--;
    } else {
      return;
    }
  }

  //should this be abstracted?
  async showFile(docIndex) {
    this.pageVariable = 1;
    // receive the data, then convert to this fucking type to show..
    let fileType = this.attachments[docIndex].title.slice(-3);

    let arrayBuff = Uint8Array.from(this.attachments[docIndex].document.data);
    if (fileType == 'pdf') {
      this.fileFromDB = new Blob([arrayBuff], { type: 'application/pdf' });
      this.uploadedFile = this.fileFromDB;
      console.log(this.fileFromDB);
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        console.log(this.pdfSrc);
        // prompt user if they want to save lol
        /* var fileSaver = saveAs(this.fileFromDB,"test.pdf")
        console.log(fileSaver); */

        const dialogRef = this.dialog.open(DialogPdf, {
          width: '600px',
          data: {
            pdfSrc: this.pdfSrc,
            pageVariable: this.pageVariable,
          },
        });
      };

      reader.readAsArrayBuffer(this.fileFromDB);
    } else if (fileType == 'ocx') {
      this.fileFromDB = new Blob([arrayBuff], { type: 'application/pdf' });
      this.uploadedFile = this.fileFromDB;
      let objectUrl = URL.createObjectURL(this.fileFromDB);

      // prompt user if they want to save lol
      /* var fileSaver = saveAs(this.fileFromDB,"test.pdf")
        console.log(fileSaver); */

      const dialogRef = this.dialog.open(DialogPdf, {
        width: '600px',
        data: {
          pageVariable: this.pageVariable,
          objectUrl: objectUrl,
        },
      });
    }

    /* let fileUrl = URL.createObjectURL(this.fileFromDB)
      const iframe = document.getElementById('pdfTest')
      iframe.setAttribute('src',fileUrl)
      URL.revokeObjectURL(fileUrl)  */

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

  deleteFile(id, index) {
    this.documentApi.deleteDocument(id).subscribe(async (res) => {
      console.log(res);
      this.documentApi.getDocument(this.task.id).subscribe((res) => {
        console.log(res);
        this.attachments = res;
        this.cdr.detectChanges();
        alert('File deleted');
      });
    });
  }

  editTask() {
    const dialogRef = this.dialog.open(DialogEdit, {
      width: '600px',
      data: {
        task_type: this.task.task_type,
        title: this.task.title,
        content: this.task.content,
        hours_spent: this.task.hours_spent,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (!result) {
        return;
      } else if (result.title && result.content && result.hours_spent) {
        console.log('poop');

        this.taskApi.editTask(this.task.id, result).subscribe((res) => {
          this.task = res.task;
          this.changeDateForm();
        });
      } else {
        alert('task not edited due to missing fields');
      }
    });
  }

  submitTask() {
    this.task.submission_date = new Date();
    this.taskApi.submitTask(this.task.id, this.task).subscribe((res) => {
      alert('task successfully submitted!');
      this.task = res.task;
      this.changeDateForm();
    });

    //to post notification 
    this.notifService.postNotifByProjectID(this.selectedProject,this.notifBody).subscribe((res) => {
      console.log(res);
      
    })




  }

  getTask(id: number) {
    //will get the task?
  }

  changeDateForm() {
    if (this.task.submission_date) {
      this.task.submission_date = this.task.submission_date.substring(0, 10);
    }
    this.task.task_due_date = this.task.task_due_date.substring(0, 10);
  }

  postFile(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
  }

  showUploadedFile() {
    //let arrayBuff = Uint8Array.from(this.fileToUpload);
    console.log(this.fileToUpload);
    let fileType = this.fileToUpload.name.slice(-3);
    if (fileType == 'pdf') {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        console.log(this.pdfSrc);
        const dialogRef = this.dialog.open(DialogPdf, {
          width: '600px',
          data: {
            pdfSrc: this.pdfSrc,
            pageVariable: this.pageVariable,
          },
        });
      };
      reader.readAsArrayBuffer(this.fileToUpload);
    }
    else if (fileType == 'ocx'){
     // this.fileFromDB = new Blob([arrayBuff], { type: 'application/pdf' });

      let objectUrl = URL.createObjectURL(this.fileToUpload);

      // prompt user if they want to save lol
      /* var fileSaver = saveAs(this.fileFromDB,"test.pdf")
        console.log(fileSaver); */

      const dialogRef = this.dialog.open(DialogPdf, {
        width: '600px',
        data: {
          pageVariable: this.pageVariable,
          objectUrl: objectUrl,
        },
      });

    }
  }

  uploadFile() {
    if (!this.fileToUpload) {
      alert('no file uploaded');
      return;
    } else {
      let formData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.documentApi.postDocument(formData, this.task.id).subscribe((res) => {
        console.log(res);
        this.documentApi.getDocument(this.task.id).subscribe((res) => {
          console.log(res);
          this.attachments = res;
          this.cdr.detectChanges();
        });
        alert('successfully uploaded!');
      });
    }
  }
}

@Component({
  selector: 'dialog-edit',
  templateUrl: './dialogEdit.html',
})
export class DialogEdit {
  constructor(
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('constructor');
  }
}

@Component({
  selector: 'dialog-pdf',
  templateUrl: './dialogPdf.html',
})
export class DialogPdf {
  constructor(
    public dialogRef: MatDialogRef<DialogPdf>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
