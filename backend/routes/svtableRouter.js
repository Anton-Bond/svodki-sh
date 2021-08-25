const express = require('express')
const controller = require('../controllers/svtableController')
const router = express.Router()

router.get('/on-current-date/:currentDate', controller.allOnCurrentDate)

router.get('/on-daybefore-date/:date', controller.getPreviosPerdayTables)

router.post('/new', controller.create)

router.post('/addNewSvatebles', controller.addNewSvatebles)

router.put('/:svtableId', controller.uptateOne)

router.delete('/:svtableDate/:svtableId', controller.removeOne)

router.put('/region/:svtableDate/:svtableId', controller.updateOneRegion)

module.exports = router
