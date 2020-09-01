'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.timestamps()
      table.text('comment')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('task_id').unsigned().references('id').inTable('tasks')
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentsSchema
