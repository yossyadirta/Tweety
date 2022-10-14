const { User, Profile, Tweet } = require('../models/index')
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
          console.log(req.session);
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
      },
      include: [Profile, Tweet]
    })
    .then(user=>{
      let session = req.session
      console.log(user);
      console.log(user, "INI DATA INCLUDE PROFILE =================");
      // console.log(req.session, '<< dari controller');
          res.render('profile', { user, session })
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static renderEditProfile(req, res){
    let { username } = req.params
    const errors = req.query.errors?JSON.parse(req.query.errors):'';
    
    User.findOne({
      where: {
        username
      },
      include: [Profile, Tweet]
    })
    .then(user=>{
      let session = req.session
      console.log(user, "INI DATA INCLUDE PROFILE =================");
      res.render('profile-edit', {user, session, errors})
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static editProfile(req, res){
   let uname = req.params.username
   const { firstName, lastName, username } = req.body
   User.update({ firstName, lastName, username }, {where: { username: uname }})
   .then(data => {
    res.redirect(`/profile/${username}`)
   })
   .catch(err=>{
    if (err.name === 'SequelizeValidationError') {
      const errors = {}
      err.errors.forEach(el => {
        errors[el.path] = el.message
      })
      res.redirect(`/profile/${username}/edit?errors=${JSON.stringify(errors)}`)
    } else {
      res.send(err)
    }
  })
  }

  static renderAdmin(req, res){
    User.findAll({where: {
      role: 'user'
    },
  include: {
    model: Profile
  }})
    .then(data=>{
      res.render('admin', {data})
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static renderAdminList(req, res){
    User.findAll({where: {
      role: 'admin'
    },
  include: {
    model: Profile
  }})
    .then(data=>{
      res.render('admin-list', {data})
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static deleteUser(req, res){
    let {id} = req.params
    User.destroy({where: {
      role: 'user',
      id: id
    },
    include: {
    model: Profile
  }})
    .then(data=>{
      res.redirect('/admin')
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static deleteAdmin(req, res){
    let {id} = req.params
    User.destroy({where: {
      role: 'admin',
      id: id
    },
    include: {
    model: Profile
  }})
    .then(data=>{
      res.redirect('/admin/admin-list')
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static verifyUser(req, res){
    let {id} = req.params
    let isVerified;

    User.findByPk(id)
    .then(data=>{
      console.log(data);
      isVerified = data.isVerified
        return  User.update({
          isVerified: !isVerified
        },{where: {
          role: 'user',
          id: id
        },
        include: {
        model: Profile
      }})
      .then(data=>{
        res.redirect('/admin')
      })
    })
    .catch(err=>{
      res.send(err)
    })
  }
}

module.exports = UserController