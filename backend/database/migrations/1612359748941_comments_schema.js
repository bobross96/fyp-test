'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.table('comments', (table) => {
      // alter 
      table.dropForeign('task_id')
      
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('cascade').alter()
    })
  }

  down () {
    
  }
}

module.exports = CommentsSchema
