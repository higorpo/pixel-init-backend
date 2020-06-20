'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicationLikesSchema extends Schema {
  up() {
    this.create('publication_likes', (table) => {
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
      table.unique(['user_id', 'publication_id'])
      table.timestamps()
    })
  }

  down() {
    this.drop('publication_likes')
  }
}

module.exports = PublicationLikesSchema
