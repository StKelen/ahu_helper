const sendRequset = require('./sendRequest')

// 该模块封装了支付请求
module.exports = async (url, cookies, data, isForm) => {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        Referer: 'http://101.76.160.144/Page/Page',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    return sendRequset(url, headers, isForm, data)
}
