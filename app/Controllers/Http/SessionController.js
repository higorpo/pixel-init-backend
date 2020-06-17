'use strict'

const Response = require('@adonisjs/framework/src/Response');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');

class SessionController {
    async store({ request, response, auth }) {
        const { email, password } = request.all();

        try {
            const token = await auth.attempt(email, password);

            const user = await User
                .query()
                .where("email", email)
                .first();

            return {
                token: token.token,
                user_id: user.id
            };
        }
        catch (error) {
            let errors = [];

            if (error.uidField) {
                errors.push({
                    field: "mail",
                    message: "e-mail incorreto!"
                })
            }

            if (error.passwordField) {
                errors.push({
                    field: "password",
                    message: "senha incorreta!"
                })
            }

            return response.status(401).send(errors);
        }
    }
}

module.exports = SessionController
