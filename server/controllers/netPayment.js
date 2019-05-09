const config = require('../config')
const payRequestPromise = require('../utils/PayRequestPromise')

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
    const returnData = await payRequestPromise(config.netPayUrl, payInfo.cookies, payInfoData, false)
    console.log(returnData.text)
}
