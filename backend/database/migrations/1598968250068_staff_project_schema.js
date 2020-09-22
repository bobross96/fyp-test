'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StaffProjectSchema extends Schema {
  up () {
    this.create('staff_project', (table) => {
      table.increments()
      table.timestamps()
      table.integer('staff_id').unsigned().references('id').inTable('staff').onDelete('cascade')
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('cascade')
    })
  }

  down () {
    this.drop('staff_project')
  }
}

module.exports = StaffProjectSchema
