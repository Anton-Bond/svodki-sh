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
    header: {
        type: String
    },
    data: {
        type: String
    }
})

module.exports = model('Svtable', svtableSchema)