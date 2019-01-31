const agent = require('superagent')
const config = require('../config')

module.exports = async ctx => {
    const payInfo = ctx.request.body
    const returnData = await roomPayRequestPromise(
    payInfo.cookies,
    payInfo.paytype,
    payInfo['payment_acc'],
    payInfo.aid,
    payInfo.account,
    payInfo.tran,
    payInfo.roomid,
    payInfo.room,
    payInfo.floorid,
    payInfo.floor,
    payInfo.buildingid,
    payInfo.building,
    payInfo.acctype
  )
    console.log(returnData)
}

function roomPayRequestPromise (
  cookies,
  paytype,
  payment_acc,
  aid,
  account,
  tran,
  roomid,
  room,
  floorid,
  floor,
  buildingid,
  building,
  acctype
) {
    const data = {
        paytype,
        payment_acc,
        aid,
        account,
        tran,
        roomid,
        room,
        floorid,
        floor,
        buildingid,
        building,
        acctype
    }
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        Referer: 'http://101.76.160.144/Page/Page',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    return new Promise((resolve, reject) => {
        agent
      .post(config.hallUrl + 'Tsm/Elec_Pay')
      .set(headers)
      .send(data)
      .type('form')
      .end((err, result) => {
          if (err) reject(err)
          resolve(result)
      })
    })
}
