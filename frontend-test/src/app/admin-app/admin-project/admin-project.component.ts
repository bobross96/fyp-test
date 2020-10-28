import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})
export class AdminProjectComponent implements OnInit {

  constructor(
    public router : Router,
    private route : ActivatedRoute,
    private api  : ApiService,
    public dialog : MatDialog,
    private cdr : ChangeDetectorRef
  ) { }

  project : any
  students : any
  staff : any
  
  displayedColumns : string[] = ['id','name','email','actions']
  

  ngOnInit(): void {
    let projectID = parseInt(this.route.snapshot.queryParamMap.get('id'));
    this.api.getProjectByID(projectID).subscribe((res) => {
      this.project = res.project
      this.students = res.students
      this.staff = res.staff
      console.log(res);
      
    })

    //getProjectByID
    
    
  }

}
