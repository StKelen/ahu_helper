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
}

function getPaymentPagePromise (cookies, forms) {
    const headers = {
        Cookie: cookies,
        'Connection': 'keep-alive',
        'Origin': 'http://101.76.160.144'
    }
    return new Promise((resolve, reject) => {
        agent.post(config.hallUrl + 'Page/Page')
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

