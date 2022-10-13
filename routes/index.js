const express = require('express');
const router = express.Router()

const tweetsRoutes = require('./tweetsRoutes');
const profilesRoutes = require('./profilesRoutes');
const adminRoutes = require('./adminRoutes');

router.get('/', (req, res) => {
	// res.redirect('/tweets/home')
	// res.send('annyeong')
})

router.use('/tweets', tweetsRoutes)
router.use('/profiles', profilesRoutes)
router.use('/admin', adminRoutes)

module.exports = router;

