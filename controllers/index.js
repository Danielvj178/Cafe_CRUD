const auth = require('./auth');
const categories = require('./categories');
const products = require('./products');
const search = require('./search');
const uploads = require('./uploads');
const user = require('./user');

module.exports = {
    ...auth,
    ...categories,
    ...products,
    ...search,
    ...uploads,
    ...user
}