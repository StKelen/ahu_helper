const cheerio = require('cheerio')
const config = require('../config')
const getCookies = require('../utils/getCookies')
const makeForms = require('../utils/makeForms')
const sendRequest = require('../utils/sendRequest')
const parseData = require('../utils/parseDataToObj')

// 该函数用于完整的获取用户校园卡支付相关的信息。如支付方式和目标
module.exports = async ctx => {
    // 通过用户发送的查询获取小程序用户OpenID
    const openId = ctx.query['open_id']
    // 通过OpenId从数据库获取用户的支付系统Cookies
    const cookies = await getCookies(openId)
    // 获取支付页面所需要附带的参数
    const formValues = await makeForms(ctx.query['id'])
    // 获取支付系统网页的页面数据
    const page = await getPaymentPage(cookies, formValues)
    // 确认支付系统是否可以连接，如果无法连接直接返回客户端错误
    if (page.code === -2) return page
    // 通过该函数将网页中的文字和数据进行提取
    const payMethods = getPayMethod(page.text)

    // 获取校园卡卡号等校园卡数据
    const cardInfoData = await getCardInfo(cookies)
    // 确认支付系统是否可以连接，如果无法连接直接返回客户端错误
    if (cardInfoData.code === -2) return cardInfoData
    // 获取电子账户等数据
    const elecAccountInfoData = await getElecAccountInfo(cookies)
    // 确认支付系统是否可以连接，如果无法连接直接返回客户端错误
    if (elecAccountInfoData.code === -2) return elecAccountInfoData
    // 将获取的校园卡信息进行处理，将字符串处理为对象，获取卡片信息
    let cardInfo = (parseData(cardInfoData))['query_card'].card
    // 将获取的电子账户信息进行处理，将字符串处理为对象，获取电子账户信息
    let elecAccountInfo = (parseData(elecAccountInfoData))['query_accinfo'].accinfo
    // 因为一人只有一个校园卡，默认获取第一个数据
    // 对校园卡的提示进行处理，简化前端处理，优化阅读体验
    cardInfo = setCardInfo(cardInfo[0])
    // 因为一人只有一个电子账户，默认获取第一个数据
    elecAccountInfo = elecAccountInfo[0]
    // 与支付请求的参数有关，电子账户支付默认为000，进行设置
    elecAccountInfo.acctype = '000'

    // 对数据进行返回客户端
    const returnData = {
        // 支付方式
        payMethods,
        // 支付目标
        payTarget: [cardInfo, elecAccountInfo],
        // 支付系统认证cookies
        cookies
    }
    ctx.state = {
        code: 0,
        data: returnData
    }
}

// 该函数用于获取支付页面的整个HTML文件
async function getPaymentPage (cookies, forms) {
    const headers = {
        Cookie: cookies,
        'Connection': 'keep-alive',
        'Origin': 'http://101.76.160.144'
    }
    return await sendRequest(config.hallUrl + '/Page/Page', headers, true, forms)
}

// 该函数用于获取页面中有关支付方式的内容
function getPayMethod (html) {
    // 加载cheerio模块
    let $ = cheerio.load(html)
    // 初始化支付方式数组
    let items = []
    // 对每一种支付方式进行处理并加入到items数组中
    $('#PayMethod option').each((index, element) => {
        let $element = $(element)
        items.push({
            value: $element.attr('value'),
            content: $element.text()
        })
    })
    // 返回支付方式
    return items
}

// 该函数用于获取校园卡信息
async function getCardInfo (cookies) {
    const headers = {
        Cookie: cookies,
        'Connection': 'keep-alive',
        'Origin': 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest'
    }
    return await sendRequest(config.hallUrl + '/User/GetCardInfoByAccountNoParm', headers, false)
}

// 该函数用于获取电子账户的有关信息
async function getElecAccountInfo (cookies) {
    const headers = {
        Cookie: cookies,
        'Connection': 'keep-alive',
        'Origin': 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest'
    }
    return await sendRequest(config.hallUrl + '/User/GetCardAccInfo', headers, false)
}

// 该函数用于对校园卡用户名进行加工处理，方便阅读。设置与支付请求的有关参数，校园卡默认为###
// 如“张三”会被处理为“张三 - 校园卡”
function setCardInfo (rawCardInfo) {
    if (rawCardInfo.cardname) rawCardInfo.name += ` - ${rawCardInfo.cardname}`
    rawCardInfo.acctype = '###'
    return rawCardInfo
}
