const express = require('express')
const router = express.Router()
const Record = require('../../models/record.js')

// 顯示所有紀錄
router.get('/', (req, res) => {
  const userId = req.user._id
  const queriedCategory = req.query.category || 'all'
  const time = new Date()
  const queriedMonth = req.query.month || time.toISOString().slice(0, 7)
  let total = 0
  let subtotal = 0

  Record.find({ userId, date: { $regex: queriedMonth } })
    .lean()

    // 計算 total
    .then(records => {
      records.forEach(record => total += record.amount)
      return records
    })

    // 回傳符合類別的資料，並計算 subtotal
    .then(records => {
      if (queriedCategory === 'all') {
        subtotal = total
        records.map(record => record.all = true)

        return records
      } else {
        const classifiedRecords = records.filter(record => record.category === queriedCategory)

        classifiedRecords.forEach(record => subtotal += record.amount)
        classifiedRecords.map(record => record[queriedCategory] = true)

        return classifiedRecords
      }
    })

    // 回傳處理好的資料到頁面
    .then(records => res.render('index', {
      records,
      total,
      subtotal,
      queriedMonth,
      [queriedCategory]: true,
      percentage: () => {
        if (!total) {
          return '0'
        } else {
          return Math.round((subtotal * 100) / total)
        }
      }
    }
    ))
    .catch(error => console.log(error))
})

// 取得建立紀錄的頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 建立新紀錄
router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, category, date, amount, retailer } = req.body

  return Record.create({
    name: name,
    category: category,
    date: date,
    amount: amount,
    retailer: retailer,
    userId
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
  let queriedMonth = ''

  return Record.findOne({ _id, userId })
    .then(record => {
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.retailer = retailer

      queriedMonth = record.date.slice(0, 7)

      return record.save()
    })

    // 回到該月份的全部類別清單
    .then(() => res.redirect(`/records?category=all&month=${queriedMonth}`))
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

