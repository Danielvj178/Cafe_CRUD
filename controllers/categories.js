const { request, response } = require('express');
const { Category } = require('../models');

const getCategories = async (req = request, res = response) => {
    const { limit = 0, from = 0 } = req.query;
    const condition = { status: true };
    try {
        const [totalCategories, categories] = await Promise.all([
            Category.countDocuments(condition),
            Category.find(condition)
                .populate('user', 'name')
                .limit(Number(limit))
                .skip(Number(from))
        ]);

        res.json({
            categories,
            totalCategories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const getCategoryById = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id).
            populate('user', 'name');

        res.json(
            category
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const createCategory = async (req = request, res = response) => {
    const { body, user } = req;
    const data = {
        name: body.name.toUpperCase(),
        user: user._id
    };

    try {
        const categoryDB = await Category.findOne({ name: data.name });

        if (categoryDB) {
            return res.status(400).json({
                msg: `Category ${data.name} exist!`
            });
        }

        const category = new Category(data);
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}

const updateCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const { status, user, ...restData } = req.body;

    restData.name = restData.name.toUpperCase();
    restData.user = req.user._id;

    try {
        const category = await Category.findByIdAndUpdate(id, restData, { new: true });

        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
}

const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        })
    }
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}