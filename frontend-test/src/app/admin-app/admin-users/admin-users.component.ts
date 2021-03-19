import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  newUser: any;
  users: any;
  dataSource: any;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  displayedColumns: string[] = ['id', 'username', 'first_name', 'email','actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.api.getUsers().subscribe((res) => {
      this.users = res.data;
      console.log(this.users);
      this.dataSource = new MatTableDataSource<any>(this.users);
      this.dataSource.paginator = this.paginator;
    });
  }

  addUser() {
    this.newUser = {};
    const dialogRef = this.dialog.open(DialogAddUser, {
      width: '600px',
      data: {
        username: this.newUser.username,
        email: this.newUser.email,
        first_name: this.newUser.first_name,
        last_name: this.newUser.last_name,
        password: this.newUser.password,
        userType: this.newUser.userType,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (!result) {
        return;
      } else {
        this.api.addUser(result).subscribe((res) => {
          if (res.registerSuccess) {
            alert(`successfully added User: ${res.user.username}`);
            this.api.getUsers().subscribe((res) => {
              this.users = res.data;
              console.log(this.users);
              this.dataSource = new MatTableDataSource<any>(this.users);
              this.dataSource.paginator = this.paginator;
            });

          } else {
            alert('user not added');
          }
        });
      }
    });
  }

  deleteUser(id) {
    console.log(id);
    this.newUser = {};
    const dialogRef = this.dialog.open(DialogEditUser, {
      width : '600px',
      data : {
        username : this.newUser.username,
        email: this.newUser.email,
        first_name: this.newUser.first_name,
        last_name: this.newUser.last_name,
        is_active : this.newUser.is_active
      }
    });


    
  }
}

@Component({
  selector: 'dialog-add-user',
  templateUrl: './dialogAddUser.html',
})
export class DialogAddUser {
  addUserForm = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    password: ['', Validators.required],
    userType: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('constructor');
  }
}


@Component({
  selector: 'dialog-edit-user',
  templateUrl: './dialogEditUser.html',
})
export class DialogEditUser {
  editUserForm = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    is_active: ['',Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEditUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('constructor');
  }
}