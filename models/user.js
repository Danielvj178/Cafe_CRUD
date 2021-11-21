const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        emun: ['ADIMN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function () {
    //Con esto se eliminan las propiedades version y password al retornar el usuario después de registrarlo
    const { __v, password, ...restUser } = this.toObject()
    restUser.uid = restUser._id
    delete restUser._id
    return restUser
}

module.exports = model('User', UserSchema)