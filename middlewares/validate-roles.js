const { response } = require("express")

const validateAdminRole = (req, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Verify authenticate before validate role permission'
        })
    }

    const { role, name } = req.user

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} doesn't is user administrator`
        })
    }

    next()
}

const permissionRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Verify authenticate before validate role permission'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `This action need some role ${roles}`
            });
        }

        next();
    }

}

module.exports = {
    validateAdminRole,
    permissionRole
}