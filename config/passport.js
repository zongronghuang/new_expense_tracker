const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {

        if (!user) {
          return done(null, false, { message: '電子郵件未註冊' })
        }


        return bcrypt.compare(password, user.password)
          .then(isMatched => {
            if (!isMatched) {
              return done(null, false, { message: '電子郵件或密碼不正確' })
            }
            return done(null, user)
          })
          .catch(err => done(err, false))

      })
  }))



  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })



}