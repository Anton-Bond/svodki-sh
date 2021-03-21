const { Schema, model } = require('mongoose')

const svtableSchema = new Schema({
    svtableId: {
        type: String,
        required: true
    },
    svtableDate: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    exth: {
        type: String
    },
    cols: {
        type: String
    },
    rows: {
        type: String
    }
})

module.exports = model('Svtable', svtableSchema)
