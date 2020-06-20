'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const { validate } = use('Validator')

const Notification = use('App/Models/Notification');

/**
 * Resourceful controller for interacting with notifications
 */
class NotificationController {
	async index({ request, response, auth }) {
		const rules = {
			page: 'number',
		}

		const validation = await validate(request.get(), rules)

		if (validation.fails()) {
			return response.status(400).send(validation.messages())
		}

		const { page } = request.get();

		const notifications = await Notification
			.query()
			.where('user_id', auth.user.id)
			.orWhere('user_id', null)
			.orderBy('created_at', 'DESC')
			.orderBy('id', 'DESC')
			.paginate(page)

		return notifications;
	}

	async store({ request, response }) {
	}
}

module.exports = NotificationController
