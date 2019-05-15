const { mysql } = require('../qcloud')

// 该模块用于通过OpenID获取支付系统凭据路由
module.exports = async openId => {
    let cookies = await mysql('cSessionInfo').select('cookies').where('open_id', '=', openId)
    return cookies[0].cookies
}
