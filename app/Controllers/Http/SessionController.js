'use strict'

const Response = require('@adonisjs/framework/src/Response');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');

class SessionController {
    async store({ request, response, auth }) {
        const { email, ticket_number } = request.all();

        try {

            const user = await User
                .query()
                .select("id", "is_admin", "first_name", "last_name", "avatar", "ticket_number")
                .setHidden(['ticket_number'])
                .where("email", email)
                .first();

            if (!user) {
                throw {
                    field: "mail",
                    message: "e-mail não corresponde ao ingresso cadastrado"
                }
            }

            if (user.ticket_number != ticket_number) {
                throw {
                    field: "ticket_number",
                    message: "o número do ingresso está incorreto"
                }
            }

            const token = await auth.generate(user);

            return {
                token: token.token,
                user
            };
        }
        catch (error) {
            let errors = [];

            console.log(error)

            errors.push(error);
            return response.status(401).send(errors);
        }
    }
}

module.exports = SessionController
