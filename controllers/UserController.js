const { User, Profile } = require('../models/index')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');


class UserController {
  static renderRegisterForm(req, res){
    res.render('auth-pages/register-form')
  }
  
  static postRegisterForm(req, res){
    const {email, username, password, role, firstName, lastName, imageURL, dateOfBirth} = req.body
    User.create({email, username, password, role})
    .then(data=> {
      const UserId = data.id
      return Profile.create({firstName, lastName, imageURL, dateOfBirth, UserId })
    })
    .then(newUser=>{
      res.redirect('/login')
    })
    .catch(err=>{
      console.log(err);
      res.send(err)
    })
  }

  static renderLoginForm(req, res){
    const {error} = req.query
    res.render('auth-pages/login-form', {error})
  }

  static postLoginForm(req, res){
    const {email, password} = req.body
    User.findOne({
      where: {
        [Op.or]: [{ email }, { username: email }],
      }
    })
    .then(user=>{
      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (isValidPassword) {
          req.session.userId = user.id
          req.session.email = user.email
          req.session.username = user.username
          req.session.role = user.role
          req.session.isVerified = user.isVerified
          if (req.session.role === 'admin') {
            res.redirect('/admin')
          } else {
            res.redirect('/tweets')
          }
        } else {
          const error = `invalid username or password`
          res.redirect(`/login?error=${error}`)
        }
      } else {
        const error = `invalid username or password`
        res.redirect(`/login?error=${error}`)
      }
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static renderHome(req, res){
    let {username} = req.session
    res.render('home', {username})
  }

  static getLogout(req, res){
    req.session.destroy((err)=>{
      if (err) {
        res.send(err);
      } else {
        res.redirect('/login')
      }
    })
  }

  static renderProfile(req, res){
    let { username } = req.params
    User.findOne({
      where: {
        username
      }
    })
    .then(user=>{
      let session = req.session
      // console.log(req.session, '<< dari controller');
          res.render(`profile`, {user, session})
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static renderAdmin(req, res){
    res.render('admin')
  }
}

module.exports = UserController