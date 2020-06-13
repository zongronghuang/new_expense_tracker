const express = require('express')
const router = express.Router()
const home = require('./modules/home.js')
const record = require('./modules/record.js')
const user = require('./modules/user.js')
const auth = require('./modules/auth.js')

router.use('/users', user)
router.use('/records', record)
router.use('/auth', auth)
router.use('/', home)

module.exports = router