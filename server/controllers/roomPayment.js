const config = require('../config')
const payRequestPromise = require('../utils/payRequestPromise')

module.exports = async ctx => {
    const payInfo = ctx.request.body
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
    const returnData = await payRequestPromise(config.roomPayUrl, payInfo.cookies, data, true)
    console.log(returnData)
}
