const agent = require('superagent')
const config = require('../config')

module.exports = async ctx => {
    const payInfo = ctx.request.body
    const returnData = await cardPayRequestPromise(
        payInfo.account,
        payInfo.acctype,
        payInfo.tranamt,
        payInfo.paymethod,
        payInfo.cookies
  )
    console.log(returnData)
    ctx.body = returnData
}

function cardPayRequestPromise (
  account,
  acctype,
  tranamt,
  paymethod,
  cookies
) {
    const data = {
        account,
        acctype,
        tranamt,
        qpwd: '',
        paymethod,
        paytype: '使用绑定的默认账号',
        client_type: 'web',
        json: true
    }
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'Referer': 'http://101.76.160.144/Page/Page',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    return new Promise((resolve, reject) => {
        agent
      .post(config.hallUrl + 'User/Account_Pay')
      .set(headers)
      .send(data)
      .type('form')
      .end((err, result) => {
          if (err) reject(err)
          resolve(result)
      })
    })
}
