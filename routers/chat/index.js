const Router = require('koa-router')

const router = new Router();

router.get('/index/:id', async (ctx) => {
    const {id} = ctx.params
    console.log(id);
    // ctx.response.body = fs.readdirSync('./pic')
    console.log('ping');
    ctx.response.body = {status : 'OK'}
    
  })

  module.exports = router
