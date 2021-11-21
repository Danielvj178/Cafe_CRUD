const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { User, Product } = require('../models');

const uploadFile = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const shortFileName = file.name.split('.');
        const extension = shortFileName[shortFileName.length - 1];

        if (!validExtensions.includes(extension)) {
            reject(`The extension ${extension} in not allowed in ${validExtensions}`);
        }

        const nameTmp = `${uuidv4()}.${extension}`;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTmp);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nameTmp);
        });
    });
}

const getObjectCollection = async (collection, id) => {
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return {
                    status: 400,
                    msg: `User with id ${id} doesn't exist`
                }
            }
            return {
                status: 200,
                model
            };
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return {
                    status: 400,
                    msg: `Product with id ${id} doesn't exist`
                }
            }
            return {
                status: 200,
                model
            };
        default:
            break;
    }
}

module.exports = {
    getObjectCollection,
    uploadFile
}