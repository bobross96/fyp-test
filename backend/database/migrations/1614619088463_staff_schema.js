'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StaffSchema extends Schema {
  up () {
    this.table('staff', (table) => {
      // alter table
      table.dropForeign('user_id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade').alter()
    })
  }

  down () {
    this.table('staff', (table) => {
      // reverse alternations
    })
  }
}

module.exports = StaffSchema
