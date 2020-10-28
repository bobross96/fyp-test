import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, 
  MAT_DIALOG_DATA,
  MatDialogRef,} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  newUser :any
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    public dialog: MatDialog,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {
  }

  addUser(){
    this.newUser = {}
    const dialogRef = this.dialog.open(DialogAddUser, {
      width : '600px',
      data : {
        username : this.newUser.username,
        email : this.newUser.email,
        first_name : this.newUser.first_name,
        last_name : this.newUser.last_name,
        password : this.newUser.password,
        userType : this.newUser.userType
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (!result){
        return 
      }
      else {
        this.api.addUser(result).subscribe((res) => {
          if (res.registerSuccess){
            alert(`successfully added User: ${res.user.username}`)
          }
          else {
            alert('user not added')
          }
          
        })
      }
      
    })

  }

  editUser(){

  }

}



@Component({
  selector: 'dialog-add-user',
  templateUrl: './dialogAddUser.html',
})
export class DialogAddUser {
  addUserForm = this.fb.group({
    email : ['',Validators.required],
    username : ['',Validators.required],
    first_name : ['',Validators.required],
    last_name : ['',Validators.required],
    password : ['',Validators.required],
    userType : ['',Validators.required]

  })
  constructor(
    private fb : FormBuilder,
    public dialogRef: MatDialogRef<DialogAddUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    
    console.log('constructor');
  }
}
