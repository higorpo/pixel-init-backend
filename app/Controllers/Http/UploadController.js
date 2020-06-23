'use strict'

const Helpers = use('Helpers')
const Hash = use('Hash')

const User = use('App/Models/User');
const Path = require('path');

class UploadController {
    async store({ request, response, auth }) {
        const profilePic = request.file('profile_pic', {
            types: ['image'],
            size: '5mb'
        })

        const imageName = `${makeid(15)}.jpg`;

        await profilePic.move(Path.resolve('public', 'uploads'), {
            name: imageName,
            overwrite: true
        })


        if (!profilePic.moved()) {
            return profilePic.error()
        }

        const user = await User.findByOrFail('id', auth.user.id);

        const userUpdated = Object.assign(user, { avatar: imageName })

        try {
            await userUpdated.save();

            return response.status(201).send({ uri: imageName });
        } catch (error) {
            return response.status(500).send({ error })
        }

        function makeid(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

    }

    async destroy({ auth, response }) {
        const user = await User.findByOrFail('id', auth.user.id);

        const userUpdated = Object.assign(user, { avatar: null })

        try {
            await userUpdated.save();

            return response.status(200).send();
        } catch (error) {
            return response.status(500).send({ error })
        }
    }
}

module.exports = UploadController
