const express = require('express')
const router = express.Router()
const home = require('./modules/home.js')
const record = require('./modules/record.js')
const user = require('./modules/user.js')
const auth = require('./modules/auth.js')
const { authenticator } = require('../middleware/auth.js')


router.use('/records', authenticator, record)
router.use('/users', user)
router.use('auth', auth)
router.use('/', authenticator, home)


module.exports = router