const { Schema, model } = require('mongoose')

const currentDateSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    tableList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Svtable'
        }
    ]
})

module.exports = model('CurrentDate', currentDateSchema)
