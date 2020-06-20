'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddThePixelthonParticipantGroupSchema extends Schema {
  up() {
    this.table('pixelthon_participants', (table) => {
      // alter table
      table
        .string('group')
        .references('name')
        .inTable('pixelthon_groups')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
        .after('user_id')
    })
  }

  down() {
    this.table('pixelthon_participants', (table) => {
      table.dropColumn('group')
    })
  }
}

module.exports = AddThePixelthonParticipantGroupSchema
