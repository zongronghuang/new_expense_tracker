const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const routes = require('./routes')

// 載入 passport
const usePassport = require('./config/passport.js')

// 使用 mongoose 與 mongoDB 連線
require('./config/mongoose.js')

const app = express()
const PORT = process.env.PORT || 3000

// 設定 rendering engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 設定 session 
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 執行 passport
usePassport(app)

app.use(flash())

// 儲存常用資料
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.total = 0
  next()
})



// 使用 routes 內的路由
app.use(routes)

app.listen(PORT, (req, res) => {
  console.log(`Server up and running at http://localhost:${PORT}`)
})

