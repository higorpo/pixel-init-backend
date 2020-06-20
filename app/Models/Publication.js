'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Publication extends Model {
    /**
     * Mutators
     */
    getIsLiked(liked) {
        return liked ? true : false;
    }

    /**
     * Relationships
     */
    author() {
        return this.belongsTo('App/Models/User').select(['id', 'first_name', 'last_name', 'avatar'])
    }

    likes() {
        return this.hasMany('App/Models/PublicationLike')
    }

    comments() {
        return this.hasMany('App/Models/PublicationComment')
    }
}

module.exports = Publication
