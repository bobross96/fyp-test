import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommentService} from '../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

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
    private fb : FormBuilder
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
  ngOnInit(): void {
    // get task id 
    this.taskID = parseInt(this.route.snapshot.queryParamMap.get('id'))
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.id);
    this.commentBody = {}
    this.commentBody.user_id = user.id
    this.commentBody.task_id = this.taskID
    this.loadComments()
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
  }

  showReply(i){
    this.showInput[i] = true
  }

  cancelReply(i){
    this.showInput[i] = false
  }

}
