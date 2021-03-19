'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.table('comments', (table) => {
      // alter table
      table.dropColumn('parent_id')
    })
  }

  down () {
    this.table('comments', (table) => {
      // reverse alternations
      table.integer('parent_id').unsigned().references('id').inTable('comments')
    })
  }
}

module.exports = CommentSchema
