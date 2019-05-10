const config = require('../config')
const payRequestPromise = require('../utils/PayRequestPromise')
const parseData = require('../utils/parseDataToObj')

// 用于发起网费支付的请求
module.exports = async ctx => {
    // 通过客户端支付相关参数
    const payInfo = ctx.request.body
    let payInfoData = {
        // 支付类型
        paytype: payInfo.paytype,
        // 默认需要参数
        'payment_acc': '',
        // 网络支付标识符。由支付系统默认
        aid: '0030000000000301',
        // 支付账号
        account: payInfo.account,
        // 支付金额
        tran: payInfo.tran,
        // 网络支付相关参数，由支付系统生成
        netacc: payInfo.netacc,
        pkgflag: 'none',
        pkg: '{}'
    }
    // 设置使用店子钱包的支付类型
    if (payInfo.paytype === '3') payInfoData.acctype = '000'
    // 发起支付请求。获取支付系统返回数据
    const returnData = await payRequestPromise(config.netPayUrl, payInfo.cookies, payInfoData, false)
    // 判断支付系统是否可以连接
    if (returnData.code === -2) return returnData
    const resultInfo = parseData(returnData)['pay_net_bank']
    // 返回客户端支付情况
    if (resultInfo.errmsg === '缴费成功') {
        ctx.state = {
            code: 0,
            data: '缴费成功'
        }
    } else {
        ctx.state = {
            code: -3,
            data: resultInfo.errmsg
        }
    }
}
