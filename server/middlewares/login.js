const agent = require('superagent')
const config = require('../config')
const {mysql} = require('../qcloud')

// 该中间件用于实现支付系统的模拟登陆
module.exports = async (ctx, next) => {
    // 从用户发送的请求中获取密码并进行处理
    const password = Buffer.from(ctx.headers['password']).toString('base64')
    // 头文件生成
    const headers = {
        Cookie: ctx.headers['cookie'],
        Connection: 'keep-alive',
        Referer: 'http://101.76.160.144/'
    }
    // 生成发送的数据对象
    const loginData = {
        // 学号
        sno: ctx.headers['study-number'],
        // 密码
        pwd: password,
        // 验证码
        ValiCode: ctx.headers['serial-number'],
        // 支付系统默认参数
        remember: 0,
        uclass: 1,
        json: true
    }
    // 向支付系统发起登陆请求
    const returnData = await sendLoginRequsetPromise(headers, loginData)
    // 验证是否登陆成功
    if (JSON.parse(returnData.text).IsSucceed) {
        // 获取用户所有的登陆凭证并将存储于数据库中
        let hallTicket = (returnData.headers['set-cookie'][0]).replace(/; path=\/; HttpOnly/, '')
        let cookies = headers.Cookie + '; ' + hallTicket
        // 继续执行下一个模块，先写入微信用户信息
        await next()
        // 通过OpenID再将个人凭据写入数据库
        const openId = ctx.state.$wxInfo.userinfo.userinfo.openId
        await updateUserInfo(openId, cookies)
    } else {
        // 返回用户登录失败信息
        ctx.state = {
            code: 0,
            data: JSON.parse(returnData.text).Msg.replace(/\//g, '')
        }
    }
}

// 该函数用于发起登录请求
function sendLoginRequsetPromise (headers, loginData) {
    const loginHeaders = Object.assign({}, headers, {
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'http://101.76.160.144'
    })
    return new Promise((resolve, reject) => {
        agent.post(config.hallUrl + '/Login/LoginBySnoQuery')
        .set(loginHeaders)
        .type('form')
        .send(loginData)
        .withCredentials()
        .end((err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

async function updateUserInfo (openId, cookies) {
    await mysql('cSessionInfo').where('open_id', '=', openId).update({
        cookies
    })
}
