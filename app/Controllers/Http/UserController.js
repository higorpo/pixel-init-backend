'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @typedef {import('@adonisjs/validator/src/Validator')} View */
const { validate } = use('Validator')

const axios = require("axios");

const User = use('App/Models/User');

const Database = use('Database');

/**
 * Resourceful controller for interacting with users
 */
class UserController {
	/**
	 * Show a list of all users.
	 * GET users
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index({ request, response, view }) {
		return { hello: "world" }
	}

	/**
	 * Create/save a new user.
	 * POST users
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, session, response }) {
		const rules = {
			mail: 'required|email',
			ticket_number: 'required|min:10|max:10'
		}

		const messages = {
			'mail.required': "você precisa digitar um e-mail",
			'mail.email': "formato de e-mail inválido",
			'ticket_number.required': "você precisa fornecer o número do ingresso do Sympla",
			'ticket_number.min': "seu número de ingresso deve ter no mínimo 10 caracteres",
			'ticket_number.max': "seu número de ingresso deve ter no máximo 10 caracteres",
		}

		const validation = await validate(request.all(), rules, messages)

		if (validation.fails()) {
			return response.status(400).send(validation.messages())
		}

		const { ticket_number, mail } = request.all();

		// Verifica se o usuário já não foi criado antes
		const userAlreadyExists = await User
			.query()
			.where('ticket_number', ticket_number)
			.orWhere('email', mail)
			.first();

		if (userAlreadyExists) {
			return response.status(200).send({ userExists: true });
		}

		try {
			const symplaApi = await axios.get(`https://api.sympla.com.br/public/v3/events/867450/participants/ticketNumber/${ticket_number}`, {
				headers: {
					"s_token": "8d52f0624bfb109a1f7b9e1ac1fd45eddbbefd0947f95f6506bb85df83753608"
				}
			})

			const data = symplaApi.data.data;

			if (data && data.id) {

				const {
					first_name,
					last_name,
					email,
					custom_form,
				} = data;

				if (mail != email) {
					throw { name: "INCORRECT_EMAIL", status: 401 }
				}

				// Pega algumas informações que o usuário preencheu durante o cadastro no Sympla
				const whatsapp = custom_form.find(form => form.id == 1192879).value;
				const linkedin = custom_form.find(form => form.id == 1192880).value;
				const github = custom_form.find(form => form.id == 1192881).value;

				const user = await User.create({
					email,
					ticket_number,
					first_name,
					last_name,
					whatsapp,
					linkedin_url: linkedin,
					github_url: github
				})

				await axios.post(`https://api.sympla.com.br/public/v3/events/867450/participants/ticketNumber/${ticket_number}/checkIn`, null, {
					headers: {
						"s_token": "8d52f0624bfb109a1f7b9e1ac1fd45eddbbefd0947f95f6506bb85df83753608"
					}
				})

				return user;
			} else {
				throw { name: "TICKET_NUMBER_NOT_FOUND", status: 404 };
			}

		} catch (error) {
			console.log(error);
			return response.status(error.status || 500).send({ error: error.name || error });
		}
	}

	/**
	 * Display a single user.
	 * GET users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show({ params, response, auth }) {
		const user = await User
			.query()
			.select(Database.raw(`IF((SELECT id FROM user_connections WHERE (user_connections.user_id = users.id AND user_connections.connected_user_id = ?) OR (user_connections.user_id = ? AND user_connections.connected_user_id = users.id) LIMIT 1) IS NOT NULL, true, false) as is_connected_with_user`, [auth.user.id, auth.user.id]))
			.select(Database.raw(`IF((SELECT id FROM notifications WHERE (notifications.user_id = users.id AND notifications.connection_request_user_id = ?) OR (notifications.user_id = ? AND notifications.connection_request_user_id = users.id) LIMIT 1) IS NOT NULL, true, false) as connection_is_requested`, [auth.user.id, auth.user.id]))
			.select('id', 'email', 'first_name', 'last_name', 'avatar', 'whatsapp', 'linkedin_url', 'github_url', 'about', 'work', 'is_admin')
			.where('id', params.id)
			.first();

		if (!user) {
			return response.status(404).send({ error: "USER_NOT_FOUND" })
		}

		return user;
	}

	/**
	 * Update user details.
	 * PUT or PATCH users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response, auth }) {
		const user = await User
			.query()
			.where('id', auth.user.id)
			.first();

		let updatedUser = Object.assign(user, request.all());

		try {
			await updatedUser.save();

			return response.status(200).send();
		} catch (error) {
			return response.status(error.status || 500).send({ error: error.name || error });
		}
	}

	/**
	 * Delete a user with id.
	 * DELETE users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, request, response }) {
	}
}

module.exports = UserController
