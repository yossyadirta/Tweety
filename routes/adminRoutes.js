const express = require('express');
const UserController = require('../controllers/UserController')
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

//GET Register
router.get('/register', UserController.renderRegisterForm)
//POST Register
router.post('/register', UserController.postRegisterForm)

//GET Login
router.get('/login', UserController.renderLoginForm)
//POST Login
router.post('/login', UserController.postLoginForm)


//Gunakan Middleware setelah login\
router.use(isLoggedIn)

router.get('/admin', isAdmin, UserController.renderAdmin)

router.get('/admin/admin-list', isAdmin, UserController.renderAdminList)
router.get('/admin/admin-list/:id/delete', isAdmin, UserController.deleteAdmin)
router.get('/admin/:id/delete', isAdmin, UserController.deleteUser)
router.get('/admin/:id/verify', isAdmin, UserController.verifyUser)

router.get('/home', isUser, UserController.renderHome)
router.get('/profile/:username', isUser, UserController.renderProfile)
router.get('/profile/:userId/edit', isUser, UserController.renderEditProfile)
router.post('/profile/:userId/edit', isUser, UserController.editProfile)


//GET Logout
router.get('/logout', UserController.getLogout)

// app.get('/tweets', isUser, Controller.home)
// app.post('/tweets/new', isUser, Controller.newTweet)

// router.post('/:username/verify', Controller.editProfile)
// router.get('/:username/delete', Controller.deleteUser)

module.exports = router;