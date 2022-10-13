const isAdmin = (req, res, next) => {
  console.log(req.session.role, '<<< Admin dari middleware')
  if (req.session.role !== 'admin') {  
    const error = 'You have no access to this page' 
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
}

const isUser = (req, res, next) => {
  console.log(req.session.role, '<<< User dari middleware')
  if (req.session.role !== 'admin') {  
    next()
  }
}

module.exports = {
  isAdmin,
  isUser
}