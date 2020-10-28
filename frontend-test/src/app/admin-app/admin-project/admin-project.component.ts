import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss'],
})
export class AdminProjectComponent implements OnInit {
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fb : FormBuilder
  ) {}
  projectID: any;
  project: any;
  students: any;
  staff: any;
  addUserForm = this.fb.group({
    email : ['',Validators.required],
    userType : ['',Validators.required]

  })


  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];

  ngOnInit(): void {
    this.projectID = parseInt(this.route.snapshot.queryParamMap.get('id'));
    this.getUsers();

    //getProjectByID
  }

  getUsers() {
    this.api.getProjectByID(this.projectID).subscribe((res) => {
      this.project = res.project;
      this.students = res.students;
      this.staff = res.staff;
      console.log(res);
    });
  }

  delinkUser(id, userType) {
    console.log(id);
    let data = {
      project_id: this.projectID,
      user_id: id,
      userType: userType,
    };
    console.log(data);

    this.api.delinkUserToProject(data).subscribe((res) => {
      console.log(res);
      this.getUsers();
    });
  }

  

  onSubmit(){
    let data = {
      email : this.addUserForm.value.email,
      project_id : this.projectID,
      userType :  this.addUserForm.value.userType
      
    }
    console.log(data);
    

    this.api.linkUserToProject(data).subscribe((res) => {
      console.log(res);
      this.getUsers()
      
    })
    
  }

}
