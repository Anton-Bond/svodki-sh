const { Schema, model } = require('mongoose')

const tableSchema = new Schema({
    tableId: {
        type: String,
        required: true,
    }
})

module.exports = model('Table', tableSchema)
