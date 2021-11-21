const { response } = require('express');

const verifyUploadFile = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).send({
            msg: 'No files were uploaded with name: file'
        });
    }

    next();
}

module.exports = {
    verifyUploadFile
}