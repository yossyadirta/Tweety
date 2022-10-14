const express = require('express');
const { Controller } = require('../controllers/controller');
const UserController = require('../controllers/UserController');
const session = require('express-session')
const { isLoggedIn } = require('../middleware/authentication')
const { isAdmin, isUser } = require('../middleware/authorization');
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

// router.post('/:username/edit', Controller.editProfile)
// router.get('/:username', Controller.profile)

module.exports = router;

