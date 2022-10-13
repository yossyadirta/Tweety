const express = require('express');
const router = express.Router()

const tweetsRoutes = require('./tweetsRoutes');
const profilesRoutes = require('./profilesRoutes');
const adminRoutes = require('./adminRoutes');

router.get('/', (req, res) => {
	res.redirect('/login')
})

router.use('/', adminRoutes)
router.use('/tweets', tweetsRoutes)
router.use('/profiles', profilesRoutes)

module.exports = router;

