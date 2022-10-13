const express = require('express');
const router = express.Router()
const { Controller } = require('../controllers/controller.js');

router.get('/', (req, res) => {
	res.send('annyeong')
})

module.exports = router;

// user role
// - liat all tweet di timeline (R)
// /home
// - create tweet
// /tweets/create
// - see tweet detail (R)
// /tweets/detail/:id
// - delete tweet (D)
// /tweets/delete/:id
// - liat profile sendiri, profile orang: endpointnya sama, tapi nnti pas ngerender button2 actionnya dibuat kondisi pake session
// /profiles/:username
// - edit profile sendiri (U), profile orang: kalo session idnya bukan kt ya gabisa akses
// /profiles/:username/edit
// - optional most liked tweet/random tweet of the day/NGAMBIL DR TWEET ORANG TWITTER BENERAN COOL

// admin role
// 1. make user official/centang biru (U)
// /admin/:username/verify
// 2. delete user (D)
// /admin/:username/delete
// 3. apus tweet (optional, buat col baru isReported) 
// /tweets/:id/:username/delete
