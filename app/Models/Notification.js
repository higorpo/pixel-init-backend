'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Notification extends Model {
    connection_requested_by_user() {
        return this.hasOne('App/Models/User', 'connection_request_user_id', 'id').select('id', 'first_name', 'last_name', 'avatar')
    }
}

module.exports = Notification
