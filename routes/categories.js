const { Router } = require('express');
const { check } = require('express-validator');
const { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryExist } = require('../helpers/db-validators');
const { validateJWT, validateFields, validateAdminRole } = require('../middlewares');

const router = Router();

// Get all categories - public
router.get('/', getCategories);

// Get category by id - public
router.get('/:id', [
    check('id', 'Id should be Mongo ID valid').isMongoId(),
    check('id').custom(categoryExist),
    validateFields
], getCategoryById);

// Create category - private - Any person with valid token
router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    validateFields
], createCategory);

// Update - private - Valid token
router.put('/:id', [
    check('id', 'Id should be Mongo ID valid').isMongoId(),
    check('id').custom(categoryExist),
    check('name', 'name is required').not().isEmpty(),
    validateJWT,
    validateFields
], updateCategory);

// Delete category - Admin
router.delete('/:id', [
    check('id', 'Id should be Mongo ID valid').isMongoId(),
    check('id').custom(categoryExist),
    validateJWT,
    validateAdminRole,
    validateFields
], deleteCategory);

module.exports = router;