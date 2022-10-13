const express = require('express');
const { Controller } = require('../controllers/controller');
const router = express.Router();

router.post('/:username/edit', Controller.editProfile)
router.get('/:username', Controller.profile)

module.exports = router;

