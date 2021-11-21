const { Category, Product, User, Role } = require('../models');

const validRole = async (role = '') => {
    const roleExist = await Role.findOne({ role });

    if (!roleExist) {
        throw new Error(`${role} doesn't exist in DB`);
    }
}

const userExistByEmail = async (email) => {
    const user = await User.findOne({ email });

    if (user) {
        throw new Error(`${email} email is registered rigth now`);
    }
}

const userExistById = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new Error(`This id doesn't exist ${id}`);
    }
}

const categoryExist = async (id) => {
    const category = await Category.findById(id);

    if (!category) {
        throw new Error(`This id category ${id} doesn't existe`);
    }
}

const productExist = async (id) => {
    const product = await Product.findById(id);

    if (!product) {
        throw new Error(`This id product ${id} doesn't existe`);
    }
}

const allowedCollections = (collection = '', collections = []) => {
    const allowed = collections.includes(collection);
    if (!allowed) {
        throw new Error(`The collection ${collection} is not allowed, ${collections}`);
    }
    return true;
}

module.exports = {
    allowedCollections,
    categoryExist,
    productExist,
    userExistByEmail,
    userExistById,
    validRole
}