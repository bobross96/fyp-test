'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JobSchema extends Schema {
  up () {
    this.table('jobs', (table) => {
      // alter table
      table.integer('hours_spent')
    })
  }

  down () {
    this.table('jobs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = JobSchema
