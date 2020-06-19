'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/validator/src/Validator')} View */

const { validate } = use('Validator')

const User = use('App/Models/User');
const PixelthonParticipant = use('App/Models/PixelthonParticipant');

var { isAfter, isBefore } = require('date-fns');

/**
 * Resourceful controller for interacting with pixelthon participants
 */
class PixelthonController {
	/**
	 * Show a list of all pixelthon participants.
	 * GET /pixelthon
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index({ request, response, view }) {
	}

	/**
	 * Create/save a new pixelthonparticipant.
	 * POST /pixelthon
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, response, auth }) {
		const rules = {
			date: 'required|string',
		}

		const messages = {
			'date.required': "você precisa de um datetime",
		}

		const validation = await validate(request.headers(), rules, messages)

		if (validation.fails()) {
			return response.status(400).send(validation.messages())
		}

		// Verifica se está dentro da data permitida para participar do Pixelthon
		const now = new Date(request.header('Date'));
		if (isAfter(now, new Date(2020, 6, 9, 22, 30)) && isBefore(now, new Date(2020, 6, 10, 23, 59))) {

			// Verifica se ainda há espaço para participar do evento
			const participants = await PixelthonParticipant.getCount()

			if (participants >= 72) {
				return response.status(403).send({ error: "MAX_NUMBER_PARTICIPANTS_REACHED" });
			} else {

				try {
					// Pode se inscrever para participar do Pixelthon
					await PixelthonParticipant.create({
						user_id: auth.user.id
					})

					return true;
				} catch (error) {
					return response.status(500).send({ error });
				}
			}
		} else {
			return response.status(403).send({ error: "OUT_OF_REGISTRATION_DATE" });
		}
	}

	/**
	 * Update pixelthonparticipant details.
	 * PUT or PATCH /pixelthon/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response }) {
	}

	/**
	 * Delete a pixelthonparticipant with id.
	 * DELETE /pixelthon/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, request, response }) {
	}
}

module.exports = PixelthonController
