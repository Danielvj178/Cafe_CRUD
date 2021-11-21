const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Please send token'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                msg: 'Invalid token - user doesnt exist in DB'
            });
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Invalid token - user delete'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });
    }
}

module.exports = {
    validateJWT
}