'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.table('comments', (table) => {
      // alter table
      table.text('content')
      table.integer('parent_id').unsigned().references('id').inTable('comments')
    })
  }

  down () {
    this.table('comments', (table) => {
      // reverse alternations
      table.text('comment')

    })
  }
}

module.exports = CommentsSchema
