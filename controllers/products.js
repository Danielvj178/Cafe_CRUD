const { request, response } = require('express');
const { Product } = require('../models');

const getProducts = async (req = request, res = response) => {
    const { limit = 0, from = 0 } = req.query;

    try {
        const [products, countProducts] = await Promise.all([
            Product.find()
                .populate('user', 'name')
                .populate('category', 'name')
                .limit(Number(limit))
                .skip(Number(from)),
            Product.countDocuments()
        ]);
        res.json({
            countProducts,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const getProductById = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ id })
            .populate('user', 'name')
            .populate('category', 'name');

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const createProducts = async (req = request, res = response) => {
    const { status, user, ...body } = req.body;

    const data = {
        name: body.name.toUpperCase(),
        user: req.user._id,
        ...body
    };

    try {
        const productDB = await Product.findOne({ name: data.name });

        if (productDB) {
            return res.status(400).json({
                msg: `This product ${data.name} already exist`
            });
        }

        const product = new Product(data);
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { status, available, ...restData } = req.body;

    if (restData.name) {
        restData.name = restData.name.toUpperCase();
    }
    restData.user = req.user._id;

    try {
        const product = await Product.findByIdAndUpdate(id, restData, { new: true });
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

module.exports = {
    createProducts,
    deleteProduct,
    getProducts,
    getProductById,
    updateProduct
}