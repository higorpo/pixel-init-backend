'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const { validate } = use('Validator')

const Publication = use('App/Models/Publication');
const PublicationLike = use('App/Models/PublicationLike');


class PublicationLikeController {
	async store({ response, params, auth }) {
		const publication = await Publication
			.query()
			.where('id', params.id)
			.first();

		if (!publication) {
			return response.status(404).send({ error: "POST_NOT_FOUND" })
		}

		try {
			await PublicationLike.create({
				user_id: auth.user.id,
				publication_id: params.id
			})

			return response.status(201).send();
		} catch (error) {
			return response.status(500).send({ error });
		}
	}

	async destroy({ response, params, auth }) {
		const publication = await Publication
			.query()
			.where('id', params.id)
			.first();

		if (!publication) {
			return response.status(404).send({ error: "POST_NOT_FOUND" })
		}

		try {
			const like = await PublicationLike
				.query()
				.where('publication_id', params.id)
				.andWhere('user_id', auth.user.id)
				.first();

			if (!like) {
				return response.status(404).send({ error: "LIKE_NOT_FOUND" });
			}

			like.delete();

			return response.status(201).send();
		} catch (error) {
			return response.status(500).send({ error });
		}
	}
}

module.exports = PublicationLikeController
