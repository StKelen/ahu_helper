const config = require('../config')
const getCookies = require('../utils/getCookies')
const sendRequest = require('../utils/sendRequest')
const parseData = require('../utils/parseDataToObj')

// 该模块用于验证用户登录的信息是否仍然有效
module.exports = async ctx => {
    // 通过用户发送的查询获取小程序用户OpenID
    const openId = ctx.request.body.openId
    // 通过OpenId从数据库获取用户的支付系统Cookies
    const cookies = await getCookies(openId)
    // 通过用户支付系统的Cookies来获取用户数据
    const accountInfoData = await getAccountInfoPromise(cookies)
    // Valid变量用于存储用户登录信息是否有效
    let valid = false
    // 尝试通过返回的数据来测试能否解析用户信息
    try {
        const accountInfo = parseData(accountInfoData)
        const vaidMsg = accountInfo['query_accinfo'].errmsg
        // 可以成功获取用户信息，Cookies仍然有效
        if (vaidMsg === '查询成功！') valid = true
    } catch (err) {
        // 无法获取或者出错，用户Cookies无效
        valid = false
    }
    // 返回用户信息
    ctx.state = {
        code: 0,
        data: {
            valid
        }
    }
}

// 该函数用于发送Ajax请求，获取用户信息
function getAccountInfoPromise (cookies) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest'
    }
    return sendRequest(config.hallUrl + '/User/GetCardAccInfo', headers, false)
}
