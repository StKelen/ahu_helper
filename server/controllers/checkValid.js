const agent = require('superagent')
const config = require('../config')
const getCookies = require('../utils/getCookies')

module.exports = async ctx => {
    const openId = ctx.request.body.openId
    const cookies = await getCookies(openId)
    const accountInfoData = await getAccountInfoPromise(cookies)
    let valid = false
    try {
        const accountInfo = JSON.parse((JSON.parse(accountInfoData.text)).Msg)
        const vaidMsg = accountInfo['query_accinfo'].errmsg
        if (vaidMsg === '查询成功！') valid = true
    } catch (err) {
        valid = false
    }
    ctx.state.data = {
        valid
    }
}

function getAccountInfoPromise (cookies) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest'
    }
    return new Promise((resolve, reject) => {
        agent
      .post(config.hallUrl + 'User/GetCardAccInfo')
      .set(headers)
      .end((err, result) => {
          if (err) reject(err)
          resolve(result)
      })
    })
}
