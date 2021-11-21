const { Router } = require('express');
const { check } = require('express-validator');

const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers');
const { allowedCollections } = require('../helpers');
const { validateFields, verifyUploadFile } = require('../middlewares');

const router = Router();

router.get('/:collection/:id', [
    check('id', 'Id should be Mongo ID valid').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], showImage);

router.post('/', verifyUploadFile, loadFile);

router.put('/:collection/:id', [
    verifyUploadFile,
    check('id', 'Id should be Mongo ID valid').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], updateImageCloudinary);
//], updateImage);

module.exports = router;