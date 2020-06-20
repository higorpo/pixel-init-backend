'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use('Validator')

const PixelthonGroup = use('App/Models/PixelthonGroup');
const PixelthonParticipant = use('App/Models/PixelthonParticipant');

const PARTICIPANTS_LIST = [
	{
		"id": 7,
		"user_id": 3,
	},
	{
		"id": 7,
		"user_id": 4,
	},
	{
		"id": 7,
		"user_id": 5,
	},
	{
		"id": 7,
		"user_id": 6,
	},
	{
		"id": 7,
		"user_id": 7,
	},
	{
		"id": 7,
		"user_id": 8,
	},
	{
		"id": 7,
		"user_id": 9,
	},
	{
		"id": 7,
		"user_id": 10,
	}, {
		"id": 7,
		"user_id": 11,
	}, {
		"id": 7,
		"user_id": 12,
	}, {
		"id": 7,
		"user_id": 13,
	}, {
		"id": 7,
		"user_id": 14,
	}, {
		"id": 7,
		"user_id": 15,
	}, {
		"id": 7,
		"user_id": 16,
	}, {
		"id": 7,
		"user_id": 17,
	}, {
		"id": 7,
		"user_id": 18,
	}, {
		"id": 7,
		"user_id": 19,
	}, {
		"id": 7,
		"user_id": 20,
	}, {
		"id": 7,
		"user_id": 21,
	}, {
		"id": 7,
		"user_id": 22,
	}, {
		"id": 7,
		"user_id": 23,
	}, {
		"id": 7,
		"user_id": 24,
	}, {
		"id": 7,
		"user_id": 25,
	}, {
		"id": 7,
		"user_id": 26,
	}, {
		"id": 7,
		"user_id": 27,
	}, {
		"id": 7,
		"user_id": 28,
	}, {
		"id": 7,
		"user_id": 29,
	}, {
		"id": 7,
		"user_id": 30,
	}, {
		"id": 7,
		"user_id": 31,
	}, {
		"id": 7,
		"user_id": 32,
	}, {
		"id": 7,
		"user_id": 33,
	}, {
		"id": 7,
		"user_id": 34,
	}, {
		"id": 7,
		"user_id": 35,
	}, {
		"id": 7,
		"user_id": 36,
	}, {
		"id": 7,
		"user_id": 37,
	}, {
		"id": 7,
		"user_id": 38,
	}, {
		"id": 7,
		"user_id": 39,
	}, {
		"id": 7,
		"user_id": 40,
	}, {
		"id": 7,
		"user_id": 41,
	}, {
		"id": 7,
		"user_id": 42,
	}, {
		"id": 7,
		"user_id": 43,
	}, {
		"id": 7,
		"user_id": 44,
	}, {
		"id": 7,
		"user_id": 45,
	}, {
		"id": 7,
		"user_id": 46,
	}, {
		"id": 7,
		"user_id": 47,
	}, {
		"id": 7,
		"user_id": 48,
	}, {
		"id": 7,
		"user_id": 49,
	}, {
		"id": 7,
		"user_id": 50,
	}, {
		"id": 7,
		"user_id": 51,
	}, {
		"id": 7,
		"user_id": 52,
	}, {
		"id": 7,
		"user_id": 53,
	}, {
		"id": 7,
		"user_id": 54,
	}, {
		"id": 7,
		"user_id": 55,
	}, {
		"id": 7,
		"user_id": 56,
	}, {
		"id": 7,
		"user_id": 57,
	}, {
		"id": 7,
		"user_id": 58,
	}, {
		"id": 7,
		"user_id": 59,
	}, {
		"id": 7,
		"user_id": 60,
	}, {
		"id": 7,
		"user_id": 61,
	}, {
		"id": 7,
		"user_id": 62,
	}, {
		"id": 7,
		"user_id": 63,
	}, {
		"id": 7,
		"user_id": 64,
	}, {
		"id": 7,
		"user_id": 65,
	}, {
		"id": 7,
		"user_id": 66,
	}, {
		"id": 7,
		"user_id": 67,
	}, {
		"id": 7,
		"user_id": 68,
	}, {
		"id": 7,
		"user_id": 69,
	}, {
		"id": 7,
		"user_id": 70,
	}, {
		"id": 7,
		"user_id": 71,
	}, {
		"id": 7,
		"user_id": 72,
	}, {
		"id": 7,
		"user_id": 73,
	}, {
		"id": 7,
		"user_id": 74,
	}
]

/**
 * Resourceful controller for interacting with pixelthongroups
 */
class PixelthonGroupController {
	/**
	 * Show a list of all pixelthongroups.
	 * GET pixelthongroups
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index({ request, response, view }) {
	}

	/**
	 * Create/save a new pixelthongroup.
	 * POST pixelthongroups
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, response, auth }) {
		// Verifica se tem permissões para criar os grupos
		if (!auth.user.is_admin) {
			return response.status(403).send({ error: "NOT_AUTHORIZED" })
		}

		const rules = {
			num_participants_group: 'required|number',
		}

		const messages = {
			'num_participants_group.required': "informe um número de participantes para o grupo",
		}

		const validation = await validate(request.all(), rules, messages)

		if (validation.fails()) {
			return response.status(400).send(validation.messages())
		}

		const { num_participants_group } = request.all()

		// Pega todos os participantes que estão sem grupos no Pixelthon
		const participants = (await PixelthonParticipant.query().where('group', null).fetch()).toJSON();

		const num_groups = participants.length / num_participants_group;

		const group_names = ['Branco', 'Azul', 'Vermelho', 'Preto', 'Roxo', 'Verde', 'Cinza', 'Amarelo', 'Marrom', 'Laranja', 'Fúcsia', 'Marfim', 'Púrpura', 'Vinho', 'Violeta', 'Terracota', 'Magenta', 'Limão', 'Lilás', 'Lavanda', 'Ferrugem', 'Esmeralda', 'Castanho'];

		try {
			for (let i = 0; i < Math.ceil(num_groups); i++) {
				await new Promise(async (resolve, reject) => {
					try {
						const group = await PixelthonGroup.create({
							name: group_names[i]
						})

						let initialParticipantNumber = i * num_participants_group;

						for (let j = initialParticipantNumber; j < initialParticipantNumber + num_participants_group; j++) {
							await new Promise(async (participantResolve, participantReject) => {
								try {
									await PixelthonParticipant
										.query()
										.where('user_id', participants[j].user_id)
										.update({
											group: group.name
										});

									participantResolve();
								} catch (error) {
									participantReject(error);
								}
							});

							if (!participants[j + 1]) {
								break;
							}

							console.log(`Participante ${j + 1} adicionado ao grupo ${i + 1}`)
						}

						resolve();
					} catch (error) {
						reject(error);
					}
				});

				console.log(`Grupo ${i + 1} criado`)
			}

			const groups = await PixelthonGroup
				.query()
				.fetch()

			return response.status(201).send({ groups });
		} catch (error) {
			await PixelthonGroup.query().delete();
			return response.status(500).send({ error });
		}
	}

	/**
	 * Update pixelthongroup details.
	 * PUT or PATCH pixelthongroups/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response }) {
	}

	/**
	 * Delete a pixelthongroup with id.
	 * DELETE pixelthongroups/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, request, response }) {
	}
}

module.exports = PixelthonGroupController
