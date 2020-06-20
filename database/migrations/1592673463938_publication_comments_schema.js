'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicationCommentsSchema extends Schema {
  up() {
    this.create('publication_comments', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('publication_id')
        .unsigned()
        .references('id')
        .inTable('publications')
        .onDelete('CASCADE')
      table
        .string('text', 255)
        .collate('utf8mb4_bin')
      table.timestamps()
    })
  }

  down() {
    this.drop('publication_comments')
  }
}

module.exports = PublicationCommentsSchema
