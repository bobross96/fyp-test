'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.increments()
      table.timestamps()
      table.string('title')
      table.text('description')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('source_user_id').unsigned().references('id').inTable('users')
      table.boolean('is_read')
    })
  }

  down () {
    this.drop('notifications')
  }
}

module.exports = NotificationSchema
