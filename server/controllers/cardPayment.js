const payRequestPromise = require('../utils/PayRequestPromise')
const config = require('../config')

module.exports = async ctx => {
    const payInfo = ctx.request.body
    const requestData = {
        account: payInfo.account,
        acctype: payInfo.acctype,
        tranamt: payInfo.tranamt,
        qpwd: '',
        paymethod: payInfo.paymethod,
        paytype: '使用绑定的默认账号',
        client_type: 'web',
        json: true
    }
    const returnData1 = await payRequestPromise(config.cardPayUrl, payInfo.cookies, requestData, true)
    console.log(returnData1)
    ctx.state = {
        code: 0,
        data: returnData1
    }
}
