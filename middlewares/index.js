const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt');
const validateRoles = require('./validate-roles');
const validateUpload = require('./validate-upload');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateUpload
}