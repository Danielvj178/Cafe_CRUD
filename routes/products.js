const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, createProducts, getProductById, updateProduct, deleteProduct } = require('../controllers');
const { categoryExist, productExist } = require('../helpers/db-validators');
const { validateFields, validateJWT, validateAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'id should be a Mongo ID valid').isMongoId(),
    check('id').custom(productExist),
    validateFields
], getProductById);

router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('category', 'category should be a Mongo ID valid').isMongoId(),
    check('category').custom(categoryExist),
    validateJWT,
    validateFields
], createProducts);

router.put('/:id', [
    check('id', 'Id should be a Mongo ID valid').isMongoId(),
    check('id').custom(productExist),
    check('category', 'category should be a Mongo ID valid').isMongoId(),
    check('name', 'name is required').not().isEmpty(),
    validateJWT,
    validateAdminRole,
    validateFields
], updateProduct);

router.delete('/:id', [
    check('id', 'Id should be a Mongo ID valid').isMongoId(),
    check('id').custom(productExist),
    validateJWT,
    validateAdminRole,
    validateFields
], deleteProduct);

module.exports = router;