'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.alter('comments',(table) => {
      // alter table
      table.dropForeign('user_id')
      
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade').alter()

    })
  }

  down () {
  }
}

module.exports = CommentsSchema
