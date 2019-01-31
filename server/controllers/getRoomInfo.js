const agent = require('superagent')
const cheerio = require('cheerio')
const config = require('../config')
const getCookies = require('../utils/getCookies')
const makeForms = require('../utils/makeForms')

module.exports = async ctx => {
    const openId = ctx.query['open_id']
    const cookies = await getCookies(openId)
    const formValues = await makeForms(ctx.query['id'])

    const pageData = await getRoomPagePromise(cookies, formValues)
    const page = pageData.text

    const studentAccount = getStudentAccount(page)
    const aid = ctx.query['id'] === '2' ? '0030000000001401' : '0030000000001402'
    const buildingsListData = await getBuildingsListPromise(cookies, aid, studentAccount)
    const buildingsList = JSON.parse(JSON.parse(buildingsListData.text).Msg)['query_elec_building'].buildingtab

    const elecAccountData = await getElecAccountBalancePromise(cookies, studentAccount)
    const elecAccountBalance = (JSON.parse((JSON.parse(elecAccountData.text)).Msg))['query_accinfo'].accinfo[0].balance

    const payList = getPayList(page)

    const returnData = {
        buildingsList,
        payList,
        elecAccountBalance,
        studentAccount,
        aid,
        cookies
    }
    ctx.state.data = returnData
}

function getRoomPagePromise (cookies, forms) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144'
    }
    return new Promise((resolve, reject) => {
        agent
      .post(config.hallUrl + 'Page/Page')
      .set(headers)
      .send(forms)
      .type('form')
      .end((err, result) => {
          if (err) reject(err)
          resolve(result)
      })
    })
}

function getBuildingsListPromise (cookies, aid, account) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'http://101.76.160.144/Page/Page'
    }

    let data = `jsondata={ "query_elec_building": { "aid": "${aid}", "account": "${account}", "area": {"area": "", "areaname": ""  } } }&funname=synjones.onecard.query.elec.building&json=true`
    data = encodeURI(data).replace(/(%20)/g, '+')
    data = data.replace(/:/g, '%3A').replace(/,/g, '%2C')

    return new Promise((resolve, reject) => {
        agent
      .post(config.hallUrl + 'Tsm/TsmCommon')
      .set(headers)
      .send(data)
      .end((err, result) => {
          if (err) reject(err)
          resolve(result)
      })
    })
}

function getStudentAccount (html) {
    let $ = cheerio.load(html)
    return $('#account1').val()
}

function getElecAccountBalancePromise (cookies, studentAccount) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'http://101.76.160.144/Page/Page'
    }
    const data = {
        account: studentAccount,
        acctype: '000'
    }
    return new Promise((resolve, reject) => {
        agent
      .post(config.hallUrl + 'user/queryaccinfo')
      .set(headers)
      .send(data)
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
