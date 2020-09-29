'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentCommentSchema extends Schema {
  up () {
    this.create('comment_reply', (table) => {
      table.increments()
      table.timestamps()
      table.integer('comment_id').unsigned().references('id').inTable('comments').onDelete('cascade')
      table.integer('parent_id').unsigned().references('id').inTable('comments').onDelete('cascade')
    })
  }

  down () {
    this.drop('comment_reply')
  }
}

module.exports = CommentCommentSchema
