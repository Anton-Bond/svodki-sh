const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user.model');

module.exports.create = async function (req, res) {
    const candidate = await User.findOne({ email: req.body.email });

    if (candidate) {
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.',
        });
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            userId: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
            role: req.body.role,
        });

        try {
            await user.save();
            res.status(201).json(user);
        } catch (e) {
            res.status(404).send(e.message || 'Some error occurred while creating User.');
        }
    }
};

module.exports.getAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users.filter((u) => u.role !== 'ROOT'));
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while receiving Users.');
    }
};

module.exports.findById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId })
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while receiving User.');
    }
};

module.exports.update = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    try {
        const user = await User.findOneAndUpdate(
            {userId: req.params.userId},
            {
                name: req.body.name,
                email: req.body.email,
                role: req.body.role
            }
        );
        res.status(201).json(user);
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while updating User.');
    }
};

module.exports.updatePassw = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;

    try {
        const user = await User.findOneAndUpdate(
            {userId: req.params.userId},
            {
                password: bcrypt.hashSync(password, salt)
            }
        );
        res.status(201).json(user);
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while updating password.');
    }
};

module.exports.removeById = async (req, res) => {
    try {
        const user = await User.findOneAndRemove(req.params.userId);
        res.status(200).json(user);
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while removing User.');
    }
};
