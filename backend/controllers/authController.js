const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/user.model')

module.exports.login = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    const candidate = await User.findOne({ email: req.body.email })

    if (candidate) {
        const passwordResult = bcrypt.compareSync(
            req.body.password,
            candidate.password
        )
        if (passwordResult) {
            const token = jwt.sign(
                {
                    id: candidate._id,
                    userId: candidate.userId,
                    name: candidate.name,
                    email: candidate.email,
                    role: candidate.role,
                },
                process.env.JWT,
                { expiresIn: 60 * 60 }
            )

            res.status(200).json({
                token: `Bearer ${token}`,
            })
        } else {
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова.',
            })
        }
    } else {
        res.status(404).json({
            message: 'Пользователь с таким email не найден.',
        })
    }
}
