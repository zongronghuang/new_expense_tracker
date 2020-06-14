const express = require('express')
const router = express.Router()
const Record = require('../../models/record.js')

// 顯示所有紀錄
router.get('/', (req, res) => {
  const userId = req.user._id

  Record.find({ userId })
    .lean()
    .then(records => res.render('index', { records }))
    .catch(error => console.log(error))
})

// 取得建立紀錄的頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 建立新紀錄
router.post('/', (req, res) => {
  Record.create({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    retailer: req.body.retailer,
    userId: req.user._id
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 取得編輯紀錄的頁面
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      record[record.category] = true

      return res.render('update', { record })
    })
    .catch(error => console.log(error))
})

// 回傳編緝過的紀錄
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, category, amount, retailer } = req.body

  return Record.findOne({ _id, userId })
    .then(record => {
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.retailer = retailer

      return record.save()
    })
    .then(() => res.redirect('/records'))
    .catch(error => console.log(error))
})

// 刪除紀錄
router.delete('/:id/delete', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/records'))
    .catch(error => console.log(error))
})

module.exports = router

