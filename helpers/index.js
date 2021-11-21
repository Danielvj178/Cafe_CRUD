const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const googleValidator = require('./google-validators');
const uploadFile = require('./upload-file');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleValidator,
    ...uploadFile,
}