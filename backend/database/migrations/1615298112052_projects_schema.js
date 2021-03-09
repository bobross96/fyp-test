'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectsSchema extends Schema {
  up () {
    this.table('projects', (table) => {
      // alter table
      table.datetime('sem_1_start_date')
      table.datetime('sem_2_start_date')
    })
  }

  down () {
    this.table('projects', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ProjectsSchema
