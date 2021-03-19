'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TasksSchema extends Schema {
  up () {
    this.create('tasks', (table) => {
      table.increments()
      table.timestamps()
      table.string('title')
      table.text('content')
      table.string('task_type')
      table.string('status')
      table.datetime('task_due_date')
      table.datetime('submission_date')
      table.integer('hours_spent')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('project_id').unsigned().references('id').inTable('projects')
      //table.integer('student_id').unsigned().references('id').inTable('students')
      //table.integer('staff_id').unsigned().references('id').inTable('staff')
      //


      
    })
  }

  down () {
    this.drop('tasks')
  }
}

module.exports = TasksSchema
