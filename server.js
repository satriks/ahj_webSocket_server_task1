const Koa = require('koa')
const { koaBody } = require('koa-body')
const { Date } = require('core-js')
const cors = require('@koa/cors')
const WS = require('ws')
const http = require('http')
const url = require('url')
const { v4: uuid } = require('uuid')

const port = 7070
const app = new Koa()

const router = require('./routers')

console.log(new Date(Date.now()).toLocaleString())
app.use(koaBody({
  multipart: true
}))
app.use(cors())

app.use(router())

const server = http.createServer(app.callback())

const wsServer = new WS.Server({
  server
})

const chatMessages = []
let onlineUsers = []

wsServer.on('connection', (ws, req) => {
  const { online, history } = url.parse(req.url, true).query
  const id = uuid()

  Array.from(wsServer.clients)
    .filter(client => client.readyState === WS.OPEN)

  ws.addEventListener('message', (message) => {
    const data = JSON.parse(message.data)
    const { author, chat } = data

    console.log(author, 'author', chat, 'chat')

    if (author) {
      console.log('on author')
      onlineUsers.push({ connect: ws, name: author, id })
      Array.from(wsServer.clients)
        .filter(client => client.readyState === WS.OPEN)
        .forEach(client => client.send(JSON.stringify({ online: onlineUsers.map(item => item.name) })))
      return
    }

    if (chat) {
      const chatMessage = JSON.parse(chat)
      chatMessages.push(chatMessage)
      Array.from(wsServer.clients)
        .filter(client => client.readyState === WS.OPEN)
        .forEach(client => client.send(JSON.stringify({ chat: chatMessages })))
    }
  })

  if (online) {
    ws.send(JSON.stringify(onlineUsers.map(item => item.name)))
  }
  if (history) {
    ws.send(JSON.stringify({ chat: chatMessages }))
  }

  ws.addEventListener('close', () => {
    console.log('соединение закрыто ' + id)
    const user = onlineUsers.find(item => item.id === id)
    if (user) {
      onlineUsers = onlineUsers.filter(item => item.id !== id)
      Array.from(wsServer.clients)
        .filter(client => client.readyState === WS.OPEN)
        .forEach(client => client.send(JSON.stringify({ online: onlineUsers.map(item => item.name) })))
    }
  })
})

// app.listen(port)
server.listen(port)
console.log('listen port ' + port)

// ---------------------------
// операции создания — создание ресурса через метод POST;

// операции чтения — возврат представления ресурса через метод GET;

// операции редактирования — перезапись ресурса через метод PUT или редактирование через PATCH;

// операции удаления — удаление ресурса через метод DELETE
