const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

const User = require('../models/user.model')

module.exports.login = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    const candidate = await User.findOne({ email: req.body.email })

    if (candidate) {
        // check password, user is exist
        const passwordResult = bcrypt.compareSync(
            req.body.password,
            candidate.password
        )
        if (passwordResult) {
            // generate token, passwords are match
            const token = jwt.sign(
                {
                    id: candidate._id,
                    userId: candidate.userId,
                    name: candidate.name,
                    email: candidate.email,
                    role: candidate.role,
                },
                keys.jwt,
                { expiresIn: 60 * 60 }
            )

            res.status(200).json({
                token: `Bearer ${token}`,
            })
        } else {
            // passwords aren't match
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова.',
            })
        }
    } else {
        // user isn't exist, send error
        res.status(404).json({
            message: 'Пользователь с таким email не найден.',
        })
    }
}
