'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StaffProjectSchema extends Schema {
  up () {
    this.create('staff_projects', (table) => {
      table.increments()
      table.timestamps()
      table.integer('staff_id').unsigned().references('id').inTable('staff')
      table.integer('project_id').unsigned().references('id').inTable('projects')
    })
  }

  down () {
    this.drop('staff_projects')
  }
}

module.exports = StaffProjectSchema
