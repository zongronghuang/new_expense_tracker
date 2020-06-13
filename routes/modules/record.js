const express = require('express')
const router = express.Router()
const Record = require('../../models/record.js')

// 顯示所有紀錄
router.get('/', (req, res) => {

})

// 取得建立紀錄的頁面
router.get('/new', (req, res) => {

})

// 建立新紀錄
router.post('/', (req, res) => {

})

// 取得編輯紀錄的頁面
router.get('/:id/edit', (req, res) => {

})

// 回傳編緝過的紀錄
router.put('/:id', (req, res) => {

})

// 刪除紀錄
router.delete('/:id/delete', (req, res) => {

})

module.exports = router

