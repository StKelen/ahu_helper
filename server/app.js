const Koa = require('koa')
const KoaStatic = require('koa-static')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 使用静态资源
// 设置静态资源根路径
const rootPath = './public'
app.use(KoaStatic(rootPath))

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
