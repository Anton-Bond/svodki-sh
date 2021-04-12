const mongoose = require('mongoose')
require('dotenv').config()

const app = require('./app')
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
