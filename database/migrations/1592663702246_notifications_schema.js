'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationsSchema extends Schema {
  up() {
    this.create('notifications', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .enu('type', ['alert', 'request_connection'])
        .notNullable()
      table
        .string('text', 255)
      table
        .integer('connection_request_user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('notifications')
  }
}

module.exports = NotificationsSchema
