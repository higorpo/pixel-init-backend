'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @typedef {import('@adonisjs/validator/src/Validator')} View */
const { validate } = use('Validator')

const axios = require("axios");

const User = use('App/Models/User');

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
			mail: 'required|email|unique:users,email',
			password: 'required|min:5|max:15',
			ticket_number: 'required|min:10|max:10'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return validation.messages()
		}

		const { ticket_number, mail, password } = request.all();

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
					password,
					ticket_number,
					first_name,
					last_name,
					whatsapp,
					linkedin_url: linkedin,
					github_url: github
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
	async show({ params, request, response, view }) {
	}

	/**
	 * Update user details.
	 * PUT or PATCH users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response }) {
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
