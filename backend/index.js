const mongoose = require('mongoose')

const app = require('./app')
const db = require('./config/db')
const port = process.env.PORT || 3838

const start = async () => {
    try {
        // conect to Mongo DB
        const url = db.uri
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        app.listen(port, db.host, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
