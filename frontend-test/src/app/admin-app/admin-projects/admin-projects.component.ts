import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})
export class AdminProjectsComponent implements OnInit {

  constructor(private api : ApiService, private router : Router) { }
  projects : any
  ngOnInit(): void {
    this.api.getProjects().subscribe((res) => {
      this.projects = res.data
      console.log(this.projects);
      
    })
  }

  projectView(id){
    this.router.navigateByUrl('/admin/admin-project?id=' +id)
  }

}
