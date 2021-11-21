const { Router } = require('express')
const { check } = require('express-validator')
const { login, googleSignIn } = require('../controllers/auth')
const { validateFields } = require('../middlewares/validate-fields')

const router = Router()

router.post('/login', [
    check('email', 'Send email valid').isEmail(),
    check('password', 'Password should be valid').not().isEmpty(),
    validateFields
], login)

router.post('/google', [
    check('id_token', 'id_token is required').not().isEmpty(),
    validateFields
], googleSignIn)

module.exports = router