const combineRoute = require('koa-combine-routers')
const chat = require('./chat')

const router = combineRoute(
  chat
)

module.exports = router
