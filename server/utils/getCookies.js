const {mysql} = require('../qcloud')

module.exports = async openId => {
    let cookies = await mysql('cSessionInfo').select('cookies').where('open_id', '=', openId)
    return cookies[0].cookies
}
