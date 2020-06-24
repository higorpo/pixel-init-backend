'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('ticket_number', 10).notNullable()
      table.string('first_name', 20).notNullable()
      table.string('last_name', 80).notNullable()
      table.text('avatar')
      table.string('whatsapp', 16).notNullable()
      table.string('linkedin_url', 255)
      table.string('github_url', 255)
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
