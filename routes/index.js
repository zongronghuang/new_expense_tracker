const express = require('express')
const router = express.Router()
const home = require('./modules/home.js')
const record = require('./modules/record.js')
const user = require('./modules/user.js')
const auth = require('./modules/auth.js')


router.use('/', home)
router.use('/records', record)
// router.use('/users', user)
// router.use('/auth', auth)

module.exports = router