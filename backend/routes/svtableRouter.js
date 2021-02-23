const express = require('express')
const controller = require('../controllers/svtableController')
const router = express.Router()

router.post('/new', controller.create)

router.get('/:svtableDate', controller.findByDate)

router.post('/on-current-date/:currentDate', controller.setOnCurrentDate)

router.get('/on-current-date/:currentDate', controller.allOnCurrentDate)

// router.get('/:svtableId', controller.findById)

// router.put('/:svtableId', controller.update)

// router.delete('/:svtableId', controller.removeById)

module.exports = router