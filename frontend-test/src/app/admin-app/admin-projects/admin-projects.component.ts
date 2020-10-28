import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})
export class AdminProjectsComponent implements OnInit {
  newProject : any
  constructor(
    private api : ApiService, 
    private router : Router,
    public dialog : MatDialog) { }
  projects : any

  displayedColumns : string[] = ['id','project_name','project_description','edit']
  ngOnInit(): void {
    this.api.getProjects().subscribe((res) => {
      this.projects = res.data 
      console.log(this.projects);
      
    })
  }

  projectView(id){
    this.router.navigateByUrl('/admin/admin-project?id=' +id)
  }

  addProject(){
    this.newProject = {}
    const dialogRef = this.dialog.open(DialogAddProject, {
      width : '600px',
      data : {
        project_description : this.newProject.description,
        project_name : this.newProject.name
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result){
        return
      }
      else {
        this.api.addProject(result).subscribe((res) => {
          if(res.addSuccess){
            this.api.getProjects().subscribe((res) => {
              this.projects = res.data
              console.log(this.projects);
              
            })
            alert('successfully added project')

          }
        })
      }
    })

  }

}



@Component({
  selector: 'dialog-add-project',
  templateUrl: './dialogAddProject.html',
})
export class DialogAddProject {
  addUserForm = this.fb.group({
    project_description : ['',Validators.required],
    project_name : ['',Validators.required],
    
  })
  constructor(
    private fb : FormBuilder,
    public dialogRef: MatDialogRef<DialogAddProject>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    
    console.log('constructor');
  }
}
