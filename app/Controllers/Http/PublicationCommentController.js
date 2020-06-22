'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use('Validator')

const Publication = use('App/Models/Publication');
const PublicationComment = use('App/Models/PublicationComment');

class PublicationCommentController {
	async index({ request, response, params }) {
		const rules = {
			page: 'number',
		}

		const validation = await validate(request.get(), rules)

		if (validation.fails()) {
			return response.status(400).send(validation.messages())
		}

		const { page } = request.get();

		const comments = await PublicationComment
			.query()
			.where('publication_id', params.id)
			.with('author')
			.orderBy('created_at', 'DESC')
			.orderBy('id', 'DESC')
			.paginate(page);

		return comments;
	}

	async store({ request, response, params, auth }) {
		const publication = await Publication
			.query()
			.where('id', params.id)
			.first();

		if (!publication) {
			return response.status(404).send({ error: "POST_NOT_FOUND" });
		}

		const rules = {
			text: 'required|string',
		}

		const validation = await validate(request.raw(), rules)

		if (validation.fails()) {
			return response.status(400).send(validation.messages())
		}

		const { text } = request.all();

		try {
			const NewComment = await PublicationComment.create({
				user_id: auth.user.id,
				publication_id: params.id,
				text: text
			})

			const comment = await PublicationComment
				.query()
				.where('id', NewComment.id)
				.with('author')
				.first();

			return response.status(201).send(comment);
		} catch (error) {
			return response.status(500).send({ error });
		}
	}

	async destroy({ params, response, auth }) {
		const comment = await PublicationComment
			.query()
			.where('id', params.id)
			.first();

		if (auth.user.is_admin == true || comment.user_id == auth.user.id) {
			try {
				await comment.delete();

				return response.status(200).send();
			} catch (error) {
				return response.status(500).send({ error });
			}
		} else return response.status(403).send({ error: "NOT_AUTHORIZED" });
	}
}

module.exports = PublicationCommentController
