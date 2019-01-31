const agent = require('superagent')
const config = require('../config')

module.exports = async ctx => {
    const payInfo = ctx.request.body
    let payInfoData = {
        paytype: payInfo.paytype,
        'payment_acc': '',
        aid: '0030000000000301',
        account: payInfo.account,
        tran: payInfo.tran,
        netacc: payInfo.netacc,
        pkgflag: 'none',
        pkg: '{}'
    }
    if (payInfo.paytype === '3') payInfoData.acctype = '000'

    const returnData = await netPayRequestPromise(payInfo.cookies, payInfoData)
    console.log(returnData)
}

function netPayRequestPromise (cookies, data) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        Referer: 'http://101.76.160.144/Page/Page',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    return new Promise((resolve, reject) => {
        agent.post(config.hallUrl + 'Tsm/Net_Pay')
        .set(headers)
        .send(data)
        .end((err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}
