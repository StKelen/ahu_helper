const config = require('../config')
const payRequestPromise = require('../utils/PayRequestPromise')
const parseData = require('../utils/parseDataToObj')

// 用于发起寝室供电、空调相关请求
module.exports = async ctx => {
    // 从客户端获取相关支付数据
    const payInfo = ctx.request.body
    // 合成支付相关参数
    const data = {
        paytype: payInfo.paytype,
        payment_acc: payInfo['payment_acc'],
        aid: payInfo.aid,
        account: payInfo.account,
        tran: payInfo.tran,
        roomid: payInfo.roomid,
        room: payInfo.room,
        floorid: payInfo.floorid,
        floor: payInfo.floor,
        buildingid: payInfo.buildingid,
        building: payInfo.building,
        acctype: payInfo.acctype
    }
    // 发起支付请求，获取支付系统返回状态
    const returnData = await payRequestPromise(config.roomPayUrl, payInfo.cookies, data, true)
    // 判断支付系统是否可以连接
    if (returnData.code === -2) return returnData
    // 获取支付返回信息并进行处理
    const returnInfo = parseData(returnData)['pay_elec_bank']
    // 返回客户端支付情况
    if (returnInfo.errmsg === '缴费成功') {
        ctx.state = {
            code: 0,
            data: '缴费成功'
        }
    } else {
        ctx.state = {
            code: -3,
            data: returnInfo.errmsg
        }
    }
}
