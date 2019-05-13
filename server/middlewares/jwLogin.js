const config = require('../config')
const {
    mysql
} = require('../qcloud')
const cheerio = require('cheerio')
const agent = require('superagent')
require('superagent-charset')(agent)

module.exports = async (ctx, next) => {
    const jwCookies = ctx.headers['jw-cookie']
    const headers = {
        'Host': 'jw2.ahu.cn',
        'Origin': 'http://jw2.ahu.cn',
        'Upgrade-Insecure-Requests': 1,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'http://jw2.ahu.cn/default2.aspx',
        'Cookie': jwCookies
    }
    const requestData = {
        '__VIEWSTATE': ctx.headers['view-state'],
        '__VIEWSTATEGENERATOR': ctx.headers['view-state-generator'],
        'txtUserName': ctx.headers['study-number'],
        'TextBox2': ctx.headers['jw-password'],
        'txtSecretCode': ctx.headers['jw-serial-number'],
        'RadioButtonList1': '%D1%A7%C9%FA',
        'Button1': '',
        'lbLanguage': '',
        'hidPdrs': '',
        'hidsc': ''
    }
    const returnData = await sendRequsetPromise(config.jwLoginUrl, headers, requestData)
    let $ = cheerio.load(returnData.text, { decodeEntities: false })
    let studentName = $('#xhxm').text()
    if (!studentName) {
        let errText = $('#form1 script').html()
        let reg = /'([^']*)'/
        let loginFailInfo = reg.exec(errText)[1]
        ctx.state = {
            code: 0,
            data: '教务' + loginFailInfo
        }
    } else {
        studentName = studentName.replace('同学', '')
        let studyNumber = $('form[name=Form1]').attr('action')
        studyNumber = studyNumber.replace('xs_main.aspx?xh=', '')
        console.log(studyNumber)
        await next()
        const openId = ctx.state.$wxInfo.userinfo.userinfo.openId
        await updateUserInfo(openId, jwCookies)
        Object.assign(ctx.state.data.userinfo, { sno: studyNumber, sname: studentName })
    }
}

async function sendRequsetPromise (url, headers, data) {
    return new Promise((resolve, reject) => {
        agent.post(url)
            .set(headers)
            .send(data)
            .type('form')
            .charset('gbk')
            .end((err, result) => {
                if (err) reject(err)
                resolve(result)
            })
    })
}

async function updateUserInfo (openId, cookies) {
    await mysql('cSessionInfo').where('open_id', '=', openId).update({
        'jw_cookies': cookies
    })
}
