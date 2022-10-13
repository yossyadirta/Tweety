const express = require('express');
const { Controller } = require('../controllers/controller');
const router = express.Router();

router.post('/:username/verify', Controller.editProfile)
router.get('/:username/delete', Controller.deleteUser)

module.exports = router;