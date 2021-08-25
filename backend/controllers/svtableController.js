const Svtable = require('../models/svtable.model')
const PerdayTable = require('../models/perdayTable.model')

module.exports.create = async function (req, res) {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    const svtable = new Svtable({
        svtableId: req.body.svtableId,
        svtableDate: req.body.svtableDate,
        name: req.body.name,
        exth: req.body.exth ? JSON.stringify(req.body.exth) : '',
        cols: req.body.cols ? JSON.stringify(req.body.cols) : '',
        rows: req.body.rows ? JSON.stringify(req.body.rows) : ''
    });

    try {
        await svtable.save();
        res.status(201).json(svtable);
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while creating svod table.');
    }
};

module.exports.addNewSvatebles = async function (req, res) {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    const svtables = req.body

    try {
        const svtables = req.body.map(table => new Svtable({
            svtableId: table.svtableId,
            svtableDate: table.svtableDate,
            name: table.name,
            exth: JSON.stringify(table.exth),
            cols: JSON.stringify(table.cols),
            rows: JSON.stringify(table.rows)
        }))
        await Svtable.create(svtables)
        res.status(201).json({success: 'true'})
    } catch (e) {
        res.status(404).json(e.message || 'Some error occurred while creating svod tables.')
    }
};

module.exports.allOnCurrentDate = async (req, res) => {
    try {
        const svtables = await Svtable.find({ svtableDate: req.params.currentDate })
        if (svtables) {
            const result = svtables.map(t => ({
                svtableId: t.svtableId,
                svtableDate: t.svtableDate,
                name: t.name ? t.name : '',
                exth: t.exth ? JSON.parse(t.exth) : [],
                cols: t.cols ? JSON.parse(t.cols) : [],
                rows: t.rows ? JSON.parse(t.rows) : []
            }))
            res.status(200).json(result)
        } else {
            res.status(404).json({message: 'Svod table not found'})
        }
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while receiving svod table.')
    }
};

module.exports.getPreviosPerdayTables = async (req, res) => {
    try {
        const tables = await PerdayTable.find({ date: req.params.date })
        if (tables) {
            const result = tables.map(t => ({
                svtableId: t.svtableId,
                date: t.date,
                rows: t.rows ? JSON.parse(t.rows) : []
            }))
            res.status(200).json(result)
        } else {
            res.status(404).json({message: 'Perday tables not found'})
        }
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while receiving perday table.')
    }
};

module.exports.uptateOne = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    try {
        const svtable = await Svtable.findOneAndUpdate(
            { svtableId: req.body.svtableId, svtableDate: req.body.svtableDate },
            {
                name: req.body.name,
                exth: req.body.exth ? JSON.stringify(req.body.exth) : '',
                cols: req.body.cols ? JSON.stringify(req.body.cols) : '',
                rows: req.body.rows ? JSON.stringify(req.body.rows) : ''
            },
            { upsert: true }
        );
        res.status(201).json(svtable);
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while updating Svtable.');
    }
};

module.exports.removeOne = async (req, res) => {
    try {
        const svtable = await Svtable.findOneAndRemove({ svtableId: req.params.svtableId, svtableDate: req.params.svtableDate });
        res.status(200).json(svtable);
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while removing User.');
    }
};

module.exports.updateOneRegion = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ success: 'false' })
    }

    try {
        const svtable = await Svtable.findOne({ svtableId: req.params.svtableId, svtableDate: req.params.svtableDate })

        if (svtable) {
            const newRows = JSON.parse(svtable.rows).map(row => row.region === req.body.region ? req.body : row)

            const newSvtable = await Svtable.findOneAndUpdate(
                { svtableId: req.params.svtableId, svtableDate: req.params.svtableDate },
                { rows: JSON.stringify(newRows) },
                { upsert: true }
            );
            res.status(200).json({ success: 'true', svtable: newSvtable });
        } else {
            res.status(404).send({ success: 'false' })
        }
    } catch (e) {
        res.status(404).send(e.message || 'Some error occurred while updating Svtable.');
    }
};
