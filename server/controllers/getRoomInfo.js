const cheerio = require('cheerio')
const config = require('../config')
const getCookies = require('../utils/getCookies')
const makeForms = require('../utils/makeForms')
const sendRequest = require('../utils/sendRequest')
const parseData = require('../utils/parseDataToObj')

module.exports = async ctx => {
    // 从客户端发送请求的查询中获取用户的OpenID
    const openId = ctx.query['open_id']
    // 通过用户的OpenID获取支付系统认证
    const cookies = await getCookies(openId)
    // 获取支付相关请求
    const formValues = await makeForms(ctx.query['id'])

    // 获取支付页面信息
    const pageData = await getRoomPage(cookies, formValues)
    // 判断支付系统是否可以连接
    if (pageData === -2) return pageData
    // 获取页面HTML内容
    const page = pageData.text

    // 获取学生账号
    const studentAccount = getStudentAccount(page)
    // 通过客户端请求判断是空调还是照明缴费
    const aid = ctx.query['id'] === '2' ? '0030000000001401' : '0030000000001402'
    // 通过学生账号获取所有可以选择的寝室楼栋
    const buildingsListData = await getBuildingsListPromise(cookies, aid, studentAccount)
    // 将获取的字符串转换为对象
    const buildingsList = parseData(buildingsListData)['query_elec_building'].buildingtab

    // 通过学生账号获取电子账户余额
    const elecAccountData = await getElecAccountBalancePromise(cookies, studentAccount)
    // 将获取的字符串转换为对象，并提取电子账户余额
    const elecAccountBalance = parseData(elecAccountData)['query_accinfo'].accinfo[0].balance

    // 通过获取支付方式
    const payList = getPayList(page)

    // 向客户端返回支付数据
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

// 该函数用于获取完整的支付页面
async function getRoomPage (cookies, forms) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144'
    }
    return await sendRequest(config.hallUrl + '/Page/Page', headers, true, forms)
}

// 该函数用于获取所有可以用于支付的寝室楼栋
function getBuildingsListPromise (cookies, aid, account) {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'http://101.76.160.144/Page/Page'
    }

    // 用于处理相关发送数据。因为支付系统的编码方式较为奇怪，所以直接使用字符串发送数据
    let data = `jsondata={ "query_elec_building": { "aid": "${aid}", "account": "${account}", "area": {"area": "", "areaname": ""  } } }&funname=synjones.onecard.query.elec.building&json=true`
    data = encodeURI(data).replace(/(%20)/g, '+')
    data = data.replace(/:/g, '%3A').replace(/,/g, '%2C')

    return sendRequest(config.hallUrl + '/Tsm/TsmCommon', headers, false, data)
}

// 获取学生账号
function getStudentAccount (html) {
    let $ = cheerio.load(html)
    return $('#account1').val()
}

// 获取目前的电子账户的余额
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
    return sendRequest(config.hallUrl + '/user/queryaccinfo', headers, true, data)
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
