'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }

    task(){
        return this.belongsTo("App/Models/Task")
    }

    comments(){
        return this
            .belongsToMany('App/Models/Comment','parent_id','comment_id')
            .pivotTable('comment_reply')
    }

    commentChild(){
        return this
            .belongsToMany('App/Models/Comment','parent_id')
            .pivotTable('comment_reply')

    }

    commentParent(){
        return this
            .belongsToMany('App/Models/Comment','comment_id')
            .pivotTable('comment_reply')

    }

    
}

module.exports = Comment
