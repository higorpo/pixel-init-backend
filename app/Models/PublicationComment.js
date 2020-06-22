'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PublicationComment extends Model {
    /**
     * Relationships
     */
    author() {
        return this.belongsTo('App/Models/User').select(['id', 'first_name', 'last_name', 'avatar'])
    }
}

module.exports = PublicationComment
