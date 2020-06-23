'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUserInformationsSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.string('about', 255).after('github_url')
      table.string('work', 255).after('about')
    })
  }

  down() {
    this.table('users', (table) => {
      table.dropColumns(['about', 'work'])
    })
  }
}

module.exports = AddUserInformationsSchema
