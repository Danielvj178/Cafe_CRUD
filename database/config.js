const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CON)
        console.log('DB Online')
    } catch (error) {
        console.log(error)
        throw new Error('The connection with DB is wrong!')
    }
}

module.exports = {
    dbConnection
}