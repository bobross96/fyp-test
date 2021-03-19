'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.table('comments', (table) => {
      // alter table
      table.dropColumn('comment')
    })
  }

  down () {
    this.table('comments', (table) => {
      // reverse alternations
      // reverse of drop is just... existing?
      table.text('comments')
    })
  }
}

module.exports = CommentsSchema
