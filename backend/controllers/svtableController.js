const { v4: uuidv4 } = require('uuid')

const Svtable = require('../models/svtable.model')

module.exports.create = async function (req, res) {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    const svtable = new Svtable({
        svtableId: uuidv4(),
        svtableDate: req.body.svtableDate,
        header: JSON.stringify(req.body.header),
        data: JSON.stringify(req.body.data)
    });

    try {
        await svtable.save();
        res.status(201).json(svtable);
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while creating svod table.');
    }
};

module.exports.findByDate = async (req, res) => {
    try {
        const svtable = await Svtable.findOne({ svtableDate: req.params.svtableDate })
        if (svtable) {
            res.status(200).json(svtable);
        } else {
            res.status(404).json({message: 'Svod table not found'});
        }
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while receiving svod table.');
    }
};
