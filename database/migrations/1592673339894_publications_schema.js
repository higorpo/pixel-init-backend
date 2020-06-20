'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicationsSchema extends Schema {
  up() {
    this.create('publications', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .string('text', 255)
        .collate('utf8mb4_bin')
      table.timestamps()
    })
  }

  down() {
    this.drop('publications')
  }
}

module.exports = PublicationsSchema
