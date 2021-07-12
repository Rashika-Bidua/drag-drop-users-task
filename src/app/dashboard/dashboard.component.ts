import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userForm:FormGroup;
  taskForm:FormGroup;
  userTaskArr = [];
  @ViewChild('userModelId') userModelId:ElementRef;
  @ViewChild('taskModelId') taskModelId:ElementRef;
  

  constructor(private fb: FormBuilder,public modal: NgbActiveModal,private modalService: NgbModal) {
  }

  /**
   *  Drag & drop item in different drag list
   *  Ref - https://material.angular.io/cdk/drag-drop/overview
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }else {
      transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex);
    }
  }

  /**
   *  Will return username array like ['a','b','c'],
   *  Required for enabling drag to different list
   */
  getConnectedTo(){
    return this.userTaskArr.map(i=>i.name);
  }
 
  /**
   *  Intializing User & task form
   */
  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required]],
      userIndex:[-1]
    });
    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required]],
      userIndex:[-1],
      taskIndex:[-1]
    });
  }

  /**
   *  Will open user modal, userModelId is id of modal by viewChild()
   */
  openUserModal(){
    this.modalService.open(this.userModelId);
  }

  /**
   *  Will receive index number, based on it get name
   *  patch name & index in form, used to update user name
   */
  openUserEditModal(i){
   let username= this.userTaskArr[i].name;
   this.userForm.patchValue({userName:username,userIndex:i})
   this.modalService.open(this.userModelId);
  }

  /**
   *  Check if form is valid
   *  check if duplicate name found, set validator true
   *  if userIndex is -1 then new entry else edit case
   */
  saveUser(){
    this.userForm.markAllAsTouched();
    if(this.userForm.valid){
      let userName = this.userForm.controls.userName.value;
      let userIndex = this.userForm.controls.userIndex.value;
      let isDuplicate = this.userTaskArr.some((val,i)=> (val.name==userName && i!=userIndex));
      if(isDuplicate){
        this.userForm.controls.userName.setErrors({ incorrect: true}); 
      }else{
        if(userIndex > -1){
          this.userTaskArr[userIndex].name=userName
        }else{
          this.userTaskArr.push({name: userName,taskList: [] });
        }
        this.userForm.patchValue({userName:'',userIndex:-1});
        this.userForm.markAsUntouched()
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: 'User Saved',
        })
      }
    }
  }

  /**
   * show delete confirmation
   * remove from array based on index
   */
  async deleteUser(index){
    let result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      this.userTaskArr.splice(index,1);
    }
    
  }
 
 
 openTaskModal(i){
    this.modalService.open(this.taskModelId)
    this.taskForm.patchValue({taskName:'',userIndex:i,taskIndex:-1});
 }
 openTaskEditModal(userIndex,taskIndex){
  this.modalService.open(this.taskModelId)
  let taskName = this.userTaskArr[userIndex].taskList[taskIndex];
  this.taskForm.patchValue({taskName:taskName,userIndex:userIndex,taskIndex:taskIndex});
}
 saveTask(){
    this.taskForm.markAllAsTouched();
    if(this.taskForm.valid){
      let userIndex = this.taskForm.controls.userIndex.value;
      let taskIndex = this.taskForm.controls.taskIndex.value;
      let taskName = this.taskForm.controls.taskName.value;
      if(taskIndex>-1){
        this.userTaskArr[userIndex].taskList[taskIndex]=taskName;
      }else{
        this.userTaskArr[userIndex].taskList.push(taskName);
      }
      this.modalService.dismissAll();
      Swal.fire({
        icon: 'success',
        title: 'Saved',
      })
      this.taskForm.patchValue({taskName:'',userIndex:-1,taskIndex:-1});
      this.taskForm.markAsUntouched()
    }  
 }

}
