const config = require('../config')
const getCookies = require('../utils/getCookies')
const sendRequest = require('../utils/sendRequest')
const parseData = require('../utils/parseDataToObj')

// 该模块用于获取用户的一些账号信息，如姓名、余额等
module.exports = async ctx => {
    // 通过客户端发起的请求获取用户的OpenID
    const openId = ctx.query['open_id']
    // 通过OpenId从数据库获取用户的支付系统Cookies
    const cookies = await getCookies(openId)
    // 获取用户个人信息的完整页面数据
    const userInfoData = await getUserPagePromise(cookies)
    // 由于默认只有一张校园卡，所以直接获取校园卡相关信息
    const userInfo = parseData(userInfoData)['query_card'].card[0]
    // 返回用户信息
    ctx.state = {
        code: 0,
        data: {
            // 学生姓名
            name: userInfo.name,
            // 校园卡名称
            cardName: userInfo.cardname,
            // 校园卡余额
            remainBalance: userInfo['db_balance'],
            // 校园卡预存金额
            comingBalance: userInfo['unsettle_amount'],
            // 学号
            studyNum: userInfo.sno
        }
    }
}

// 该函数用于发送Ajax请求，获取用户数据
function getUserPagePromise (cookies) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'Referer': 'http://101.76.160.144/Page/Page',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    return sendRequest(config.hallUrl + '/User/GetCardInfoByAccountNoParm', headers, false)
}
