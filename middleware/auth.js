module.exports = {
  authenticator: (req, res, next) => {

    console.log('req session', req.session)

    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '需先登入才能使用 in middleware')
    res.redirect('/users/login')
  }
}

