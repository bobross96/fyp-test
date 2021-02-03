'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FilesSchema extends Schema {
  up () {
    this.table('files', (table) => {
      // alter table
      table.dropForeign('task_id')

      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('cascade').alter()
    })
  }

  down () {
    this.table('files', (table) => {
      // reverse alternations
    })
  }
}

module.exports = FilesSchema
