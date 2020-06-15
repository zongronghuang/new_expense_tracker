const express = require('express')
const router = express.Router()
const Record = require('../../models/record.js')

// 顯示所有紀錄
router.get('/', (req, res) => {
  const userId = req.user._id
  const queriedCategory = req.query.category || 'all'
  const time = new Date()
  const queriedMonth = req.query.month || time.toISOString().slice(0, 7)

  let subtotal = 0
  console.log('res1', res.locals.total)
  Record.find({ userId, date: { $regex: queriedMonth } })
    .lean()

    // 計算 total
    .then(records => {
      records.forEach(record => res.locals.total += record.amount)
      return records
    })

    // 回傳符合類別的資料，並計算 subtotal
    .then(records => {
      if (queriedCategory === 'all') {
        subtotal = res.locals.total
        return records
      } else {
        const classifiedRecords = records.filter(record => record.category === queriedCategory)

        classifiedRecords.forEach(record => subtotal += record.amount)

        return classifiedRecords
      }
    })

    // 回傳處理好的資料到頁面
    .then(records => res.render('index', {
      records,
      total: res.locals.total,
      subtotal,
      queriedMonth,
      queriedCategory: () => {
        if (queriedCategory === 'all') {
          return this.all = true
        } else {
          return this[queriedCategory] = true
        }
      },
      percentage: () => {
        if (!res.locals.total) {
          return '0'
        } else {
          return Math.round((subtotal * 100) / res.locals.total)
        }
      }
    }
    ))
    .catch(error => console.log(error))


  // if (queriedCategory !== 'all') {
  //   let subtotal = 0
  //   console.log('res3', res.locals.total)
  //   Record.find({ userId, category: queriedCategory, date: { $regex: queriedMonth } })
  //     .lean()
  //     .then(records => records.map(record => {
  //       const category = record.category
  //       record[category] = true
  //       return record
  //     }))
  //     .then(records => {
  //       records.forEach(record => subtotal += record.amount)
  //       return records
  //     })
  //     .then(records => res.render('index', {
  //       records,
  //       total: res.locals.total,
  //       subtotal,
  //       queriedMonth,
  //       [queriedCategory]: true,
  //       percentage: () => {
  //         if (!res.locals.total) {
  //           return '0'
  //         } else {
  //           return Math.round((subtotal * 100) / res.locals.total)
  //         }
  //       }
  //     }))
  //     .catch(error => console.log(error))
  // }

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

