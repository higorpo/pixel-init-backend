'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PixelthonGroupsSchema extends Schema {
  up() {
    this.create('pixelthon_groups', (table) => {
      table
        .string('name')
        .notNullable()
        .unique()
      table.timestamps()
    })
  }

  down() {
    this.drop('pixelthon_groups')
  }
}

module.exports = PixelthonGroupsSchema
