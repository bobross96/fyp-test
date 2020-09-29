'use strict'

const Comment = use('App/Models/Comment')
const Task = use('App/Models/Task')
const User = use('App/Models/User')

class CommentController {


    // get all comments tagged to task
    async taskIndex({params,request,response}){
        const taskID = params.id
        const task = await Task.find(taskID)
        const comments = await task.comment().fetch()
        const commentsWithUser = await Promise.all(comments.rows.map(async (comment) => {
            
            // fetch user model that made the comment
            const user = await comment.user().fetch()
            
            try {
                comment.replies = await comment.commentChild().fetch()
                // comment with replies 
                if (comment.replies.rows.length != 0){
                    const repliesWithUser = await Promise.all(comment.replies.rows.map(async (reply) => {
                    const user = await reply.user().fetch()
                    reply.username = user.username
                    return reply
                }))
                comment.replies = repliesWithUser
                comment.username = user.username 
                } 
                //condition for comment with no replies and replies
                else {
                    const checkForReply = await comment.commentParent().fetch()
                    comment.username = user.username
                    // is a reply
                    if (checkForReply.rows.length != 0){ 
                        comment.parent_id = comment.id
                    }
                    
                }
               

                
            } catch (error) {
                console.log(error);
            }
            
            
            return comment
        })
        )

        
        response.json(commentsWithUser)

    }

    async create({request, response}){
        const comment = await request.all()
        const commentDB = new Comment()
        commentDB.content = comment.content
        commentDB.user_id = comment.user_id
        commentDB.task_id = comment.task_id
        await commentDB.save()

        //must save before attaching child comment to parent comment
        if (comment.parent_id){
            const parentComment = await Comment.find(comment.parent_id)
            try {
                await parentComment.comments().attach(commentDB.id)    
            } catch (error) {
                console.log(error);
            }
            
        }

        response.json(commentDB)

    }

    async linkCommentToReply({params,request,response}){
        const commentID = params.id
        const comment = await Comment.find(commentID)
        await comment.comments().attach(1)

        response.json(comment)

    }

    async show({request, response}){

    }
    
}

module.exports = CommentController
