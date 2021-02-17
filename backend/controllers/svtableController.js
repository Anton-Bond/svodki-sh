const { v4: uuidv4 } = require('uuid')

const Svtable = require('../models/svtable.model')
const CurrentDate = require('../models/currentDate.model')

module.exports.create = async function (req, res) {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    const svtable = new Svtable({
        svtableId: uuidv4(),
        svtableDate: req.body.svtableDate,
        name: req.body.name,
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
            const resTable = {
                svtableId: svtable.svtableId,
                svtableDate: svtable.svtableDate,
                name: svtable.name,
                header: JSON.parse(svtable.header),
                data: JSON.parse(svtable.data)
            }
            res.status(200).json(resTable);
        } else {
            res.status(404).json({message: 'Svod table not found'});
        }
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while receiving svod table.');
    }
};

module.exports.setOnCurrentDate = async (req, res) => {
    const options = {
        upsert: true
    }
    try {

        const currentDate = await CurrentDate.findOneAndUpdate(
            { date: req.params.currentDate },
            { tableList: req.body.tableList },
            options
        );
        res.status(201).json(currentDate);
    } catch (e) {
        res.status(404).send(e.message || 'Some went wrong from setOnCurrentDate')
    }
};

module.exports.allOnCurrentDate = async (req, res) => {
    try {
        const svtables = await CurrentDate.findOne({ date: req.params.currentDate })
            .populate('tableList')
            // .exec((err, data) => {
            //     if (err) {
            //         return res.status(401).send(err.message || 'Some went wrong');
            //     }
            //     const result = data.tableList.map(t => ({
            //         svtableId: t.svtableId,
            //         svtableDate: t.svtableDate,
            //         name: t.name ? t.name : '',
            //         header: JSON.parse(t.header),
            //         data: JSON.parse(t.data)
            //     }))
            //     console.log(result)

            //     res.status(200).json(result)
            // })
        if (svtables) {
            const result = svtables.tableList.map(t => ({
                svtableId: t.svtableId,
                svtableDate: t.svtableDate,
                name: t.name ? t.name : '',
                header: JSON.parse(t.header),
                data: JSON.parse(t.data)
            }))
            res.status(200).json(result)
        } else {
            res.status(404).json({message: 'Svod table not found'})
        }
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while receiving svod table.')
    }
};
