const mongoose = require('mongoose')
require('dotenv').config()
const cron = require('node-cron')

const app = require('./app')
const saveToPerdayTablesEveryDay = require('./utils/saveToPerdayTablesEveryDay')

const port = process.env.PORT || 3838

const start = async () => {
    try {
        const url = process.env.DB
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        app.listen(port, process.env.HOST, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

// CRON JOB
const HH = process.env.CRON_JOB_HH
const MM = process.env.CRON_JOB_MM

cron.schedule(`${MM} ${HH} * * *`, () => {
    saveToPerdayTablesEveryDay()
})
