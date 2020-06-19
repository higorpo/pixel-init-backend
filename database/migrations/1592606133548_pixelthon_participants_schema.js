'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PixelthonParticipantsSchema extends Schema {
  up() {
    this.create('pixelthon_participants', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('pixelthon_participants')
  }
}

module.exports = PixelthonParticipantsSchema
