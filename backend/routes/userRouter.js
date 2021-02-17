const express = require('express');
const controller = require('../controllers/userController');
const router = express.Router();

router.get('/', controller.getAll)

router.post('/new', controller.create)

router.get('/:userId', controller.findById)

router.put('/:userId', controller.update)

router.put('/passw/:userId', controller.updatePassw)

router.delete('/:userId', controller.removeById)

module.exports = router;
