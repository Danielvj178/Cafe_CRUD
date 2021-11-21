const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

const collectionsAllowed = [
    'categories',
    'products',
    'role',
    'users'
];

const searchUsers = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = RegExp(term, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json({
        results: users
    });
}

const searchCategories = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const category = await Category.findById(term)
            .populate('user', 'name');
        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = RegExp(term, 'i');

    const categories = await Category.find({ name: regex, status: true })
        .populate('user', 'name');

    res.json({
        results: categories
    });
}

const searchProducts = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const products = await Product.findById(term)
            .populate('category', 'name')
            .populate('user', 'name');
        return res.json({
            results: (products) ? [products] : []
        });
    }

    const regex = RegExp(term, 'i');

    const products = await Product.find({ name: regex, status: true })
        .populate('category', 'name')
        .populate('user', 'name');

    res.json({
        results: products
    });
}

const search = async (req = request, res = response) => {
    const { collection, term } = req.params;

    if (!collectionsAllowed.includes(collection)) {
        return res.status(400).json({
            msg: `The collection ${collection} is not allowed. The collections allowed are ${collectionsAllowed}`
        });
    }

    switch (collection) {
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'users':
            searchUsers(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'Please contact with an administrator because this collection is wrong'
            });
            break;
    }
}

module.exports = {
    search
}