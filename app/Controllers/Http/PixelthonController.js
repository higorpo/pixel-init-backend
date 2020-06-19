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
	 * Mostra informações do Pixelthon
	 * GET /pixelthon
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index({ request, response, auth }) {
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

		const participants = await PixelthonParticipant.getCount();

		const is_participant = await PixelthonParticipant
			.query()
			.where('user_id', auth.user.id)
			.getCount()

		let is_within_the_application_deadline = false;

		const now = new Date(request.header('Date'));
		if (isAfter(now, new Date(2020, 6, 9, 22, 29)) && isBefore(now, new Date(2020, 6, 10, 23, 59))) {
			is_within_the_application_deadline = true;
		} else {
			is_within_the_application_deadline = false;
		}

		return {
			participants,
			is_participant: is_participant ? true : false,
			is_within_the_application_deadline
		}
	}

	/**
	 * Demonstra interesse para participar do Pixelthon
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
		if (isAfter(now, new Date(2020, 6, 9, 22, 29)) && isBefore(now, new Date(2020, 6, 10, 23, 59))) {

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
}

module.exports = PixelthonController
