const express = require('express')
const router = express.Router()
const Record = require('../../models/record.js')

router.get('/', (req, res) => {

  Record.find()
    .lean()
    .then(records => res.redirect('/records'))
    .catch(error => console.log(error))
})

module.exports = router

