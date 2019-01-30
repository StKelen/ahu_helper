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
    const studentAccount = getStudentAccount(pageData.text)
    const buildingsList = await getBuildingsListPromise(cookies, ctx.query['id'], studentAccount)
    console.log(JSON.parse(buildingsList.text))
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

function getBuildingsListPromise (cookies, indexId, account) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'http://101.76.160.144/Page/Page'
    }

    const aid = indexId === '2' ? '0030000000001401' : '0030000000001402'
    let data = `jsondata={ "query_elec_building": { "aid": "${aid}", "account": "${account}", "area": {"area": "", "areaname": ""  } } }&funname=synjones.onecard.query.elec.building&json=true`
    data = encodeURI(data).replace(/(%20)/g, '+')
    data = data.replace(/:/g, '%3A')
    data = data.replace(/,/g, '%2C')

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
