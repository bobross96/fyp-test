'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TasksSchema extends Schema {
  up () {
    this.table('tasks', (table) => {
      // alter table
      table.dropForeign('user_id')
      table.dropForeign('project_id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade').alter()
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('cascade').alter()
    })
  }

  down () {
    this.table('tasks', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TasksSchema
