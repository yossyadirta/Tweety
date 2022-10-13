const express = require('express')
const app = express()
const port = 3000
const router = require('./routes')
const session = require('express-session')
const UserController = require('./controllers/UserController')
const { isLoggedIn } = require('./middleware/authentication')
const { isAdmin, isUser } = require('./middleware/authorization')


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/views'));

// app.get('/', router)

app.use(session({
  secret: 'Secret Tweety Session', //mengamankan session, hanya dev yang tahu untuk pengamanan, isi bebas
  resave: false, //menyimpan jejak user berupa id/username. mau ada perubahan/tidak dan ingin disimpan maka value true, pasang false jika hanya ada perubahan
  saveUninitialized: false, //gunakan falsy untuk implementasi login session
  cookie: { 
    secure: false, //gunakan false karena masih di tahap development untuk http
    sameSite: true //untuk security
  } 
}))

app.get('/', (req, res)=>{
  res.redirect('/login')
})

//GET Register
app.get('/register', UserController.renderRegisterForm)
//POST Register
app.post('/register', UserController.postRegisterForm)

//GET Login
app.get('/login', UserController.renderLoginForm)
//POST Login
app.post('/login', UserController.postLoginForm)

//Gunakan Middleware setelah login\

// Kalo mau dipake untuk 1 controller simpan function session di dalam variabel, nanti di app.get tinggal dimasukin ke param sebelum controller. Panggil function dari middleware/auth.js

app.use(isLoggedIn)

app.get('/admin', isAdmin, UserController.renderAdmin)

app.get('/home', isUser, UserController.renderHome)
app.get('/profile/:username', isUser, UserController.renderProfile)

//GET Logout
app.get('/logout', UserController.getLogout)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})