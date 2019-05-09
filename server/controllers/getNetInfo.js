const cheerio = require('cheerio')
const config = require('../config')
const getCookies = require('../utils/getCookies')
const makeForms = require('../utils/makeForms')
const sendRequest = require('../utils/sendRequest')
const parseData = require('../utils/parseDataToObj')

// 该函数用于完整的获取用户网络支付相关的信息。
module.exports = async ctx => {
    // 通过客户端发起的请求获取用户的OpenID
    const openId = ctx.query['open_id']
    // 通过OpenId从数据库获取用户的支付系统Cookies
    const cookies = await getCookies(openId)
    // 获取支付页面所需要附带的参数
    const formValues = await makeForms(ctx.query['id'])
    // 设置用户的网络支付目标，只有城市热点。充值参数如下
    const aid = '0030000000000301'

    // 获取网络充值完整页面
    const pageData = await getNetPagePromise(cookies, formValues)
    // 判断支付系统是否可以连接
    if (pageData.code === -2) return pageData
    // 通过返回的页面数据获取HTML文档
    const page = pageData.text
    // 通过支付页面来获取支付方式
    const payList = getPayList(page)
    // 获取学生的学工号
    const studentAccount = getStudentAccount(page)
    // 用于获取网络相关支付数据，支付时需要
    const netQueryData = await getNetaccPromise(cookies, aid, studentAccount)
    const netQuery = parseData(netQueryData)
    const netaccObj = netQuery['query_net_info'].netacc
    const netacc = JSON.stringify(netaccObj)

    // 向客户端返回网络支付参数
    const returnData = {
        payList,
        studentAccount,
        netacc,
        cookies
    }
    ctx.state.data = returnData
}

// 该函数用于获取完整的支付页面
function getNetPagePromise (cookies, forms) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144'
    }
    return sendRequest(config.hallUrl + '/Page/Page', headers, true, forms)
}

// 获取可以使用的支付方式
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

// 该函数用于获取学工号
function getStudentAccount (html) {
    let $ = cheerio.load(html)
    return $('#account1').val()
}

// 用于获取支付相关参数
function getNetaccPromise (cookies, aid, account) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'http://101.76.160.144/Page/Page'
    }
    // 用于处理相关发送数据。因为支付系统的编码方式较为奇怪，所以直接使用字符串发送数据
    let data = `jsondata={ "query_net_info": { "aid":"${aid}", "account": "${account}","payacc": "" } }&funname=synjones.onecard.query.net.info&json=true`
    data = encodeURI(data).replace(/(%20)/g, '+')
    data = data.replace(/:/g, '%3A').replace(/,/g, '%2C')
    return sendRequest(config.hallUrl + '/Tsm/TsmCommon', headers, false, data)
}
