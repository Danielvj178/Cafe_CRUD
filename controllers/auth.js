const { response } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { generateJWT } = require('../helpers/generate-jwt')
const { googleVerify } = require('../helpers/google-validators')

const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.status) {
            return res.status(400).json({
                msg: 'User / Password are incorrects - user'
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User / Password are incorrects - Password'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(500).json({
            error
        });
    }

}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, img, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                email,
                password: 'A',
                img,
                google: true
            }

            user = new User(data);
            await user.save();
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Please contact an administrator. There are error with your user!'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            msg: 'Ok',
            token,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Token invalid'
        });
    }
}

module.exports = {
    login,
    googleSignIn
}
