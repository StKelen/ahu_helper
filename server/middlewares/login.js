const agent = require('superagent')
const config = require('../config')
const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {
    const password = Buffer.from(ctx.headers['password']).toString('base64')
    const headers = {
        Cookie: ctx.headers['cookie'],
        Connection: 'keep-alive',
        Referer: 'http://101.76.160.144/'
    }
    const loginData = {
        sno: ctx.headers['study-number'],
        pwd: password,
        ValiCode: ctx.headers['serial-number'],
        remember: 0,
        uclass: 1,
        json: true
    }
    const returnData = await sendLoginRequsetPromise(headers, loginData)
    if (JSON.parse(returnData.text).IsSucceed) {
        let hallTicket = (returnData.headers['set-cookie'][0]).replace(/; path=\/; HttpOnly/, '')
        let cookies = headers.Cookie + '; ' + hallTicket
        await next()
        const openId = ctx.state.$wxInfo.userinfo.userinfo.openId
        await updateUserInfo(openId, cookies)
    }
}

function sendLoginRequsetPromise (headers, loginData) {
    const loginHeaders = Object.assign({}, headers, {
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'http://101.76.160.144'
    })
    return new Promise((resolve, reject) => {
        agent.post(config.hallUrl + 'Login/LoginBySnoQuery')
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

function realLoginPromise (headers) {
    return new Promise((resolve, reject) => {
        agent.get(config.hallUrl + 'User/User')
        .set(headers)
        .end((err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

async function updateUserInfo (openId, cookies) {
    await mysql('cSessionInfo').where('open_id', '=', openId).update({
        cookies
    })
}
