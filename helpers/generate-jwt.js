const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('There are a problem generate Token. Please contact an administrator');
            } else {
                resolve(token);
            }
        })
    });
}

module.exports = {
    generateJWT
}