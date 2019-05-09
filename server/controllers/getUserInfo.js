const config = require('../config')
const getCookies = require('../utils/getCookies')
const sendRequest = require('../utils/sendRequest')

module.exports = async ctx => {
    const openId = ctx.query['open_id']
    const cookies = await getCookies(openId)
    const userInfoData = await getUserPagePromise(cookies)
    const userInfo = (JSON.parse((JSON.parse(userInfoData.text)).Msg))['query_card'].card[0]
    console.log(userInfo)
    ctx.state.data = {
        name: userInfo.name,
        cardName: userInfo.cardname,
        remainBalance: userInfo['db_balance'],
        comingBalance: userInfo['unsettle_amount'],
        studyNum: userInfo.sno

    }
}

function getUserPagePromise (cookies) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'Referer': 'http://101.76.160.144/Page/Page',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    return sendRequest(config.hallUrl + '/User/GetCardInfoByAccountNoParm', headers, false)
}
