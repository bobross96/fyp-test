'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentSchema extends Schema {
  up () {
    this.create('students', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('project_id').unsigned().references('id').inTable('projects')
      table.string('group_name')
    })
  }

  down () {
    this.drop('students')
  }
}

module.exports = StudentSchema
