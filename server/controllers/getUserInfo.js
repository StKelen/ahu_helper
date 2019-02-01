const agent = require('superagent')
const config = require('../config')
const getCookies = require('../utils/getCookies')

module.exports = async ctx => {
    const openId = ctx.query['open_id']
    const cookies = await getCookies(openId)
    const userPageData = await getUserPagePromise(cookies)
    console.log(userPageData.text)
}

function getUserPagePromise (cookies) {
    const headers = {
        Cookie: cookies,
        'Connection': 'keep-alive',
        'Origin': 'http://101.76.160.144'
    }
    return new Promise((resolve, reject) => {
        agent.get(config.hallUrl + 'User/User')
        .set(headers)
        .end((err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}
