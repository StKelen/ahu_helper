const agent = require('superagent')
const config = require('../config')

module.exports = async (ctx, next) => {
    const bufferPwd = Buffer.from(ctx.headers['password'])
    const password = bufferPwd.toString('base64')
    const headers = {
        Cookie: ctx.headers['cookie'],
        'Connection': 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'http://101.76.160.144/',
        'Origin': 'http://101.76.160.144'
    }
    var loginData = {
        sno: ctx.headers['study-number'],
        pwd: password,
        ValiCode: ctx.headers['serial-number'],
        remember: 0,
        uclass: 1,
        json: true
    }
    const returnData = await sendLoginRequsetPromise(headers, loginData)
    console.log(returnData.body)
}

function sendLoginRequsetPromise (headers, loginData) {
    return new Promise((resolve, reject) => {
        agent.post(config.hallUrl + 'Login/LoginBySnoQuery')
        .set(headers)
        .type('form')
        .send(loginData)
        .withCredentials()
        .end((err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}
