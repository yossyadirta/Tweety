const isLoggedIn = (req, res, next) => {
  console.log(req.session, '<<< User logged in')
  if (!req.session.email) {  
    const error = 'You have to login' 
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
}

module.exports = {
  isLoggedIn
}