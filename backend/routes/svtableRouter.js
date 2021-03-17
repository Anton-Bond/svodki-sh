const express = require('express')
const controller = require('../controllers/svtableController')
const router = express.Router()

router.get('/on-current-date/:currentDate', controller.allOnCurrentDate)

router.post('/new', controller.create)

router.post('/addNewSvatebles', controller.addNewSvatebles)

router.get('/:svtableDate', controller.findByDate)

router.put('/:svtableId', controller.uptateOne)

router.post('/on-current-date/:currentDate', controller.setOnCurrentDate)

router.delete('/:svtableId', controller.removeOne)

router.put('/region/:svtableId', controller.updateOneRegion)

// router.get('/:svtableId', controller.findById)

module.exports = router
