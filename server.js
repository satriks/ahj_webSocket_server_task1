const Koa = require('koa')
const { koaBody } = require('koa-body')
const { Date } = require('core-js')
const cors = require('@koa/cors')
const fs = require('fs')
const koaStatic = require('koa-static')
const WS = require('ws')
const http = require('http')


const port = 7070
const app = new Koa()

const router = require('./routers')

console.log(new Date(Date.now()).toLocaleString())
app.use(koaBody({
  multipart: true
}))
app.use(cors())


app.use(router())

app.listen(port)

const server = http.createServer(app.callback())

const wsServer = new WS.Server({
  server
})

wsServer.on('connection', (ws) => {
  ws.send('from ws')
})

console.log('listen port ' + port)

// ---------------------------
// операции создания — создание ресурса через метод POST;

// операции чтения — возврат представления ресурса через метод GET;

// операции редактирования — перезапись ресурса через метод PUT или редактирование через PATCH;

// операции удаления — удаление ресурса через метод DELETE.
