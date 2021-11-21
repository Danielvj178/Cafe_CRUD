const { response, request } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// Require response for VSC know methods from res.
const getUsers = async (req = request, res = response) => {
    //const { q, name = 'No name', apikey, page = 1, limit = 10 } = req.query
    const { limit = 5, from = 0 } = req.query

    const condition = {
        status: true
    }

    // Ejecución de promesas en serie
    /* const users = await User.find(condition).skip(Number(from)).limit(Number(limit))
     const totalUsers = await User.countDocuments(condition) */

    // Ejecución de promesas en Paralelo
    const [totalUsers, users] = await Promise.all([
        User.countDocuments(condition),
        User.find(condition).skip(Number(from)).limit(Number(limit))
    ])

    res.json({
        totalUsers,
        users
    })
}

const postUsers = async (req, res = response) => {
    const { name, email, role, password } = req.body
    const user = new User({ name, email, role, password })

    try {
        // For default is 10
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(password, salt)

        await user.save()
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

const putUsers = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, email, ...restUser } = req.body;

    // Si se envía el parámetro de la contraseña es porque se va a actualizar y se debe de encrriptar nuevamente
    if (password) {
        const salt = bcrypt.genSaltSync();
        restUser.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, restUser, { new: true });

    res.json(user)
}

const patchUsers = (req, res = response) => {
    res.json({
        msg: 'Hi Patch'
    })
}

const deleteUsers = async (req, res = response) => {
    const { id } = req.params

    // Borrado fisico
    //const user = await User.findByIdAndDelete(id)

    // Borrado lógico
    const user = await User.findByIdAndUpdate(id, { status: false })

    res.json(
        user
    )
}

module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
}