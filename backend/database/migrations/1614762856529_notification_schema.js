'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSchema extends Schema {
  up () {
    this.table('notifications', (table) => {
      // alter table
      table.integer('event_id')
      table.string('event_type')
    })
  }

  down () {
    this.table('notifications', (table) => {
      // reverse alternations
    })
  }
}

module.exports = NotificationSchema
