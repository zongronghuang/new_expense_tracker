const express = require('express')
const router = express.Router()
const User = require('../../models/user.js')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// 取得登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 進行登入檢查
router.post('/login', (req, res, next) => {
  if (!req.body.email || !req.body.password) req.flash('warning_msg', '需先登入才能使用')
  next()
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  let errors = []

  if (!email || !password || !confirmPassword) errors.push({ message: '電子郵件和密碼都是必填' })

  if (password !== confirmPassword) errors.push({ message: '密碼輸入錯誤' })

  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了' })

        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }

      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出')
  res.redirect('/users/login')
})

module.exports = router