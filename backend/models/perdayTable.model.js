const { Schema, model } = require('mongoose')

const perdaySchema = new Schema({
    svtableId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    rows: {
        type: String
    }
})

module.exports = model('PerdayTable', perdaySchema)
