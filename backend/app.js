const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const userRoutes = require('./routes/userRouter')
const authRoutes = require('./routes/authRouter')
const svtableRoutes = require('./routes/svtableRouter')

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(require('cors')())
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})


// ===================== ROUTES ====================
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/sv-table', svtableRoutes)
// =================== END ROUTES ==================

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error', {
        title: 'Страница не найдена',
    })
})

module.exports = app
