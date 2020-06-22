'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use('Validator')
const Database = use('Database');

const Publication = use('App/Models/Publication');

class PublicationController {
	async index({ request, response, auth }) {
		const rules = {
			page: 'number',
		}

		const validation = await validate(request.get(), rules)

		if (validation.fails()) {
			return response.status(400).send(validation.messages())
		}

		const { page } = request.get();

		const publications = await Publication
			.query()
			.select('*')
			.select(Database.raw(`IF((SELECT id FROM publication_likes WHERE publication_likes.publication_id = publications.id AND publication_likes.user_id = ? LIMIT 1) IS NOT NULL, true, false) as is_liked`, [auth.user.id]))
			.with('author')
			.withCount('likes')
			.withCount('comments')
			.orderBy('created_at', 'DESC')
			.orderBy('id', 'DESC')
			.paginate(page);

		return publications;
	}

	async store({ request, response, auth }) {
		const rules = {
			text: 'required|string',
		}

		const validation = await validate(request.raw(), rules)

		if (validation.fails()) {
			return response.status(400).send(validation.messages())
		}

		const { text } = request.all();

		try {
			const NewPost = await Publication.create({
				user_id: auth.user.id,
				text: text
			})

			const publication = await Publication
				.query()
				.select('*')
				.select(Database.raw(`IF((SELECT id FROM publication_likes WHERE publication_likes.publication_id = publications.id AND publication_likes.user_id = ? LIMIT 1) IS NOT NULL, true, false) as is_liked`, [auth.user.id]))
				.with('author')
				.withCount('likes')
				.withCount('comments')
				.where('id', NewPost.id)
				.first();

			return response.status(201).send(publication);
		} catch (error) {
			return response.status(500).send({ error });
		}
	}

	async show({ params, request, response, view }) {
	}

	async update({ params, request, response }) {
	}

	async destroy({ params, request, response, auth }) {
		const publication = await Publication
			.query()
			.where("id", params.id)
			.first();

		if (auth.user.is_admin == true || publication.user_id == auth.user.id) {
			try {
				await publication.delete();

				return response.status(200).send();
			} catch (error) {
				return response.status(500).send({ error });
			}
		} else return response.status(403).send({ error: "NOT_AUTHORIZED" });
	}
}

module.exports = PublicationController
