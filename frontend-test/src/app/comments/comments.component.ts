import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommentService} from '../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  constructor(
    private api : ApiService,
    private commentApi : CommentService,
    private route : ActivatedRoute,
    private fb : FormBuilder,
    private notifService : NotificationService
  ) { }
  
  commentForm = this.fb.group({
    comment : ['',Validators.required]
  })

  replyForm = this.fb.group({
    reply : ['',Validators.required]
  })

  

  taskID : number
  comments : any
  parentComments : any
  replies : any
  commentBody : any
  showInput = []
  related_id = []
  notifBody : any
  ngOnInit(): void {
    // get task id 
    this.taskID = parseInt(this.route.snapshot.queryParamMap.get('id'))
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(userInfo);
    this.commentBody = {}
    this.commentBody.user_id = userInfo.user.id
    this.commentBody.task_id = this.taskID
    this.loadComments()
    userInfo.groupMates.forEach(student => {
      this.related_id.push(student.user_id)
    });

    userInfo.staff.forEach(staff => {
      this.related_id.push(staff.user_id)
    });

    console.log(this.related_id);
    
    this.notifBody = {
      title : "New Comment",
      description : "",
      id_array : this.related_id,
      source_user_id : userInfo.user.id,
      is_read : false,
      event_id : this.taskID,
      event_type : "task"
    }
    // then get the comments
    
  }

  loadComments(){
    this.commentApi.getCommentsByTask(this.taskID).subscribe((res) => {
      console.log(res);
      
      this.parentComments = []
      this.replies = []
      res.forEach(comment => {
        if (!comment.parent_id){
          this.parentComments.push(comment)
        }
      });
     
      // load parent comments first
      // then loop thru child comments to add according to date? or random lmao..
      
    })

  
  }

  onSubmit(){
    this.commentBody.parent_id = null
    this.commentBody.content = this.commentForm.value.comment

    this.commentApi.postComment(this.commentBody).subscribe((res) => {
      console.log(res);
      this.commentForm.reset()
      this.loadComments()
      
    })

    this.notifBody.description = this.commentBody.content

    this.notifService.postManyNotif(this.notifBody).subscribe((res) => {
      console.log(res);
    })


  }

  replySubmit(id){
    this.commentBody.parent_id = id
    this.commentBody.content = this.replyForm.value.reply
    console.log(this.commentBody)
    this.commentApi.postComment(this.commentBody).subscribe((res) => {
      console.log(res);
      this.replyForm.reset()
      this.loadComments()
      
    })

    this.notifBody.description = this.commentBody.content

    this.notifService.postManyNotif(this.notifBody).subscribe((res) => {
      console.log(res);
    })


  }

  showReply(i){
    this.showInput[i] = true
  }

  cancelReply(i){
    this.showInput[i] = false
  }

}
