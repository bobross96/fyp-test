'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.table('comments', (table) => {
      // alter table
    })
  }

  down () {
    this.table('comments', (table) => {
      // reverse alternations
      table.dropColumn('comment')
    })
  }
}

module.exports = CommentsSchema
