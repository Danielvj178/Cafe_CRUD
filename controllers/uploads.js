const { response } = require('express');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile, getObjectCollection } = require('../helpers');

const loadFile = async (req, res = response) => {
    try {
        // Upload files
        //const nameFile = await uploadFile(req.files, ['txt', 'md'], 'texts');
        const nameFile = await uploadFile(req.files, undefined, 'img');

        res.json({
            nameFile
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const updateImage = async (req, res = response) => {
    const { collection, id } = req.params;

    try {
        const response = await getObjectCollection(collection, id);

        if (response.status === 200 && response.model.img) {
            const pathImage = path.join(__dirname, '../uploads', collection, response.model.img);
            if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage);
            }
        }

        const nameFile = await uploadFile(req.files, undefined, collection);
        response.model.img = nameFile;

        await response.model.save();

        res.json(response.model);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const showImage = async (req, res = response) => {
    const { collection, id } = req.params;

    try {
        const response = await getObjectCollection(collection, id);

        if (response.status === 200 && response.model.img) {
            const pathImage = path.join(__dirname, '../uploads', collection, response.model.img);
            if (fs.existsSync(pathImage)) {
                return res.sendFile(pathImage);
            }
        }
        const pathNoFound = path.join(__dirname, '../assets', 'no-image.jpg');
        return res.sendFile(pathNoFound);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const updateImageCloudinary = async (req, res = response) => {
    const { collection, id } = req.params;

    try {
        const response = await getObjectCollection(collection, id);

        if (response.status === 200 && response.model.img) {
            if (response.model.img) {
                const nameImage = response.model.img.split('/');
                const name = nameImage[nameImage.length - 1];
                const [public_id] = name.split('.');
                cloudinary.uploader.destroy(public_id);
            }
        }


        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        response.model.img = secure_url;

        await response.model.save();

        res.json(response.model);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

module.exports = {
    loadFile,
    showImage,
    updateImage,
    updateImageCloudinary
}