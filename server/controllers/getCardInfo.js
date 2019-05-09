const agent = require('superagent')
const cheerio = require('cheerio')
const config = require('../config')
const getCookies = require('../utils/getCookies')
const makeForms = require('../utils/makeForms')

module.exports = async ctx => {
    const openId = ctx.query['open_id']
    const cookies = await getCookies(openId)
    const formValues = await makeForms(ctx.query['id'])
    const page = await getPaymentPagePromise(cookies, formValues)
    const payMethods = getPayMethod(page.text)

    const cardInfoData = await getCardInfoPromise(cookies)
    const elecAccountInfoData = await getElecAccountInfoPromise(cookies)
    let cardInfo = (JSON.parse((JSON.parse(cardInfoData.text)).Msg))['query_card'].card
    let elecAccountInfo = (JSON.parse((JSON.parse(elecAccountInfoData.text)).Msg))['query_accinfo'].accinfo

    cardInfo = setCardInfo(cardInfo[0])
    elecAccountInfo = elecAccountInfo[0]
    elecAccountInfo.acctype = '000'

    const returnData = {
        payMethods,
        payTarget: [cardInfo, elecAccountInfo],
        cookies
    }
    ctx.state.data = returnData
}

function getPaymentPagePromise (cookies, forms) {
    const headers = {
        Cookie: cookies,
        'Connection': 'keep-alive',
        'Origin': 'http://101.76.160.144'
    }
    return new Promise((resolve, reject) => {
        agent.post(config.hallUrl + '/Page/Page')
        .set(headers)
        .send(forms)
        .type('form')
        .end((err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

function getPayMethod (html) {
    let $ = cheerio.load(html)
    let items = []
    $('#PayMethod option').each((index, element) => {
        let $element = $(element)
        items.push({
            value: $element.attr('value'),
            content: $element.text()
        })
    })
    return items
}

function getCardInfoPromise (cookies) {
    const headers = {
        Cookie: cookies,
        'Connection': 'keep-alive',
        'Origin': 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest'
    }
    return new Promise((resolve, reject) => {
        agent.post(config.hallUrl + '/User/GetCardInfoByAccountNoParm')
        .set(headers)
        .end((err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

function getElecAccountInfoPromise (cookies) {
    const headers = {
        Cookie: cookies,
        'Connection': 'keep-alive',
        'Origin': 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest'
    }
    return new Promise((resolve, reject) => {
        agent.post(config.hallUrl + '/User/GetCardAccInfo')
        .set(headers)
        .end((err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

function setCardInfo (rawCardInfo) {
    if (rawCardInfo.cardname) rawCardInfo.name += ` - ${rawCardInfo.cardname}`
    rawCardInfo.acctype = '###'
    return rawCardInfo
}
