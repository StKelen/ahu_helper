const payRequestPromise = require('../utils/PayRequestPromise')
const config = require('../config')
const parseData = require('../utils/parseDataToObj')

// 用于发起校园卡支付请求
module.exports = async ctx => {
    // 从用户发送的请求获取支付相关数据
    const payInfo = ctx.request.body
    // 生成发送的数据对象
    const requestData = {
        // 支付账号
        account: payInfo.account,
        // 支付目标
        acctype: payInfo.acctype,
        // 支付金额，以分为单位
        tranamt: payInfo.tranamt,
        // 支付系统默认参数
        qpwd: '',
        // 支付方式
        paymethod: payInfo.paymethod,
        paytype: '使用绑定的默认账号',
        client_type: 'web',
        json: true
    }
    // 对数据进行发送至支付系统，发起支付请求。获取返回数据
    const returnData = await payRequestPromise(config.cardPayUrl, payInfo.cookies, requestData, true)
    // 判断支付系统是否可以连接
    if (returnData.code === -2) return returnData
    // 获取支付情况
    const returnInfo = parseData(returnData).transfer
    // 返回客户端支付情况
    if (returnInfo.errmsg === '转账成功') {
        ctx.state = {
            code: 0,
            data: '转账成功'
        }
    } else {
        ctx.state = {
            code: -3,
            data: returnInfo.errmsg
        }
    }
}
