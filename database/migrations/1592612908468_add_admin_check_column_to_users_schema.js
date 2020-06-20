'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddAdminCheckColumnToUsersSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table
        .boolean('is_admin')
        .defaultTo(false)
        .after('github_url')
    })
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('is_admin')
    })
  }
}

module.exports = AddAdminCheckColumnToUsersSchema
