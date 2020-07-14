const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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


  // Comment out Facebook passport for local development
  //////// Facebook passport \\\\\

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json

    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)

        bcrypt.gentSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(error => done(err, false))
      })
  }))



  //////// Facebook passport \\\\\

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