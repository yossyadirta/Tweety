const express = require('express');
const { Controller } = require('../controllers/controller');
const session = require('express-session')
const { isLoggedIn } = require('../middleware/authentication')
const { isAdmin, isUser } = require('../middleware/authorization')
const router = express.Router();

router.use(session({
	  secret: 'Secret Tweety Session', //mengamankan session, hanya dev yang tahu untuk pengamanan, isi bebas
	  resave: false, //menyimpan jejak user berupa id/username. mau ada perubahan/tidak dan ingin disimpan maka value true, pasang false jika hanya ada perubahan
	  saveUninitialized: false, //gunakan falsy untuk implementasi login session
	  cookie: { 
	    secure: false, //gunakan false karena masih di tahap development untuk http
	    sameSite: true //untuk security
	  } 
	})
)

router.use(isLoggedIn)
router.use(isUser)

router.get('/', Controller.home)
router.post('/new', Controller.newTweet)
router.get('/:id/delete', Controller.deleteTweet)
router.get('/:id/detail', Controller.detailTweet)

module.exports = router;




// user role
// - liat all tweet di timeline (R) (done)
// /home
// - create tweet (done)
// /tweets/create
// - see tweet detail (R) (done)
// /tweets/detail/:id
// - delete tweet (D) (done)
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