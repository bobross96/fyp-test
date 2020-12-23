import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormArray} from '@angular/forms';
import { NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-teamboard',
  templateUrl: './teamboard.component.html',
  styleUrls: ['./teamboard.component.scss']
})
export class TeamboardComponent implements OnInit {

  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
  }

  boardForm = this.fb.group({
    todo : this.fb.array([
     
    ]),

    doing : this.fb.array([
      this.fb.group({
        job : this.fb.control('')
      })
    ]),

    done : this.fb.array([
      this.fb.group({
        job : this.fb.control('')
      })
    ])

  })

  get todo(){
    return this.boardForm.get('todo') as FormArray
  }

  get doing(){
    return this.boardForm.get('doing') as FormArray
  }
  get done(){
    return this.boardForm.get('done') as FormArray
  }

  deleteControl(lala,boardType,index){
    console.log(lala);
    
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
    switch(jobType){
      case "todo":
        this.todo.push( this.fb.group({
          job : this.fb.control('')
        }))
        break;
      case "doing":
        this.doing.push( this.fb.group({
          job : this.fb.control('')
        }))
        break;
      case "done":
        this.done.push( this.fb.group({
          job : this.fb.control('')
        }))
        break;
      default:
        break;
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    //update index of formgroup?
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      
    }


  }

}
