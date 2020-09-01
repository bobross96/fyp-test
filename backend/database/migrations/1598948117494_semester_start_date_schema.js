'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SemesterStartDateSchema extends Schema {
  up () {
    this.create('semester_start_dates', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('semester_start_dates')
  }
}

module.exports = SemesterStartDateSchema
