'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');
const UserConnection = use('App/Models/UserConnection');
const Notification = use('App/Models/Notification');

/**
 * Resourceful controller for interacting with userconnections
 */
class UserConnectionController {
	async store({ params, response, auth }) {
		const user = await User
			.query()
			.where('id', params.id)
			.first();

		if (!user) {
			return response.status(404).send({ error: "USER_NOT_FOUND" });
		}

		try {
			await Notification.create({
				user_id: params.id,
				type: "request_connection",
				connection_request_user_id: auth.user.id
			})

			return response.status(201).send();
		} catch (error) {
			return response.status(500).send({ error });
		}
	}

	async update({ params, response, auth }) {
		const notification = await Notification
			.query()
			.where('user_id', auth.user.id)
			.andWhere('type', 'request_connection')
			.andWhere('connection_request_user_id', params.id)
			.first();

		if (!notification) {
			return response.status(404).send({ error: "USER_NOT_REQUESTED_CONNECTION" });
		}

		try {
			await UserConnection.create({
				user_id: auth.user.id,
				connected_user_id: params.id
			})

			await notification.delete();

			return response.status(200).send();
		} catch (error) {
			return response.status(500).send({ error });
		}
	}

	async destroy({ params, request, response, auth }) {
		const notification = await Notification
			.query()
			.where('user_id', auth.user.id)
			.andWhere('type', 'request_connection')
			.andWhere('connection_request_user_id', params.id)
			.first();

		if (!notification) {
			return response.status(404).send({ error: "USER_NOT_REQUESTED_CONNECTION" });
		}

		try {
			await notification.delete();

			return response.status(200).send();
		} catch (error) {
			return response.status(500).send({ error });
		}
	}
}

module.exports = UserConnectionController
