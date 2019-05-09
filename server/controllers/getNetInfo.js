const agent = require('superagent')
const cheerio = require('cheerio')
const config = require('../config')
const getCookies = require('../utils/getCookies')
const makeForms = require('../utils/makeForms')

module.exports = async ctx => {
    const openId = ctx.query['open_id']
    const cookies = await getCookies(openId)
    const formValues = await makeForms(ctx.query['id'])
    const aid = '0030000000000301'

    const pageData = await getNetPagePromise(cookies, formValues)
    const page = pageData.text
    const payList = getPayList(page)
    const studentAccount = getStudentAccount(page)
    const netQueryData = await getNetaccPromise(cookies, aid, studentAccount)
    const netQuery = JSON.parse((JSON.parse(netQueryData.text)).Msg)
    const netaccObj = netQuery['query_net_info'].netacc
    const netacc = JSON.stringify(netaccObj)

    const returnData = {
        payList,
        studentAccount,
        netacc,
        cookies
    }
    ctx.state.data = returnData
}

function getNetPagePromise (cookies, forms) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144'
    }
    return new Promise((resolve, reject) => {
        agent
      .post(config.hallUrl + '/Page/Page')
      .set(headers)
      .send(forms)
      .type('form')
      .end((err, result) => {
          if (err) reject(err)
          resolve(result)
      })
    })
}

function getPayList (html) {
    let $ = cheerio.load(html)
    let list = []
    $('#paytype option').each((index, element) => {
        let $element = $(element)
        list.push({
            paytype: $element.attr('value'),
            name: $element.text()
        })
    })
    return list
}

function getStudentAccount (html) {
    let $ = cheerio.load(html)
    return $('#account1').val()
}

function getNetaccPromise (cookies, aid, account) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'http://101.76.160.144/Page/Page'
    }

    let data = `jsondata={ "query_net_info": { "aid":"${aid}", "account": "${account}","payacc": "" } }&funname=synjones.onecard.query.net.info&json=true`
    data = encodeURI(data).replace(/(%20)/g, '+')
    data = data.replace(/:/g, '%3A').replace(/,/g, '%2C')

    return new Promise((resolve, reject) => {
        agent
      .post(config.hallUrl + '/Tsm/TsmCommon')
      .set(headers)
      .send(data)
      .end((err, result) => {
          if (err) reject(err)
          resolve(result)
      })
    })
}
