const config = require('../config')
const {
    mysql
} = require('../qcloud')
const cheerio = require('cheerio')
const agent = require('superagent')
require('superagent-charset')(agent)

// 该中间件用于处理教务系统登录相关模块
module.exports = async (ctx, next) => {
    // 从用户发送的请求头上获取cookies
    const jwCookies = ctx.headers['jw-cookie']
    // 设置教务系统的请求头
    const headers = {
        'Host': 'jw2.ahu.cn',
        'Origin': 'http://jw2.ahu.cn',
        'Upgrade-Insecure-Requests': 1,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'http://jw2.ahu.cn/default2.aspx',
        'Cookie': jwCookies
    }
    // 设置发送的数据
    const requestData = {
        // 教务系统的识别参数
        '__VIEWSTATE': ctx.headers['view-state'],
        '__VIEWSTATEGENERATOR': ctx.headers['view-state-generator'],
        // 学号
        'txtUserName': ctx.headers['study-number'],
        // 密码
        'TextBox2': ctx.headers['jw-password'],
        // 验证码
        'txtSecretCode': ctx.headers['jw-serial-number'],
        // 类型为学生登录，保持默认
        'RadioButtonList1': '%D1%A7%C9%FA',
        // 教务系统默认为空的参数
        'Button1': '',
        'lbLanguage': '',
        'hidPdrs': '',
        'hidsc': ''
    }
    // 发送登录请求
    let returnData
    try {
        returnData = await sendRequsetPromise(config.jwLoginUrl, headers, requestData)
    } catch (e) {
        ctx.state = {
            'code': -2,
            'data': {
                'desc': '服务器连接失败'
            }
        }
    }
    // 对返回的文件进行解析。因为Super Agent charset模块已经进行编码转换，所以这里关闭编码转换
    let $ = cheerio.load(returnData.text, { decodeEntities: false })
    // 尝试能否获取文档中的学生姓名
    let studentName = $('#xhxm').text()
    // 判断是否有学生姓名
    if (!studentName) {
        // 没有学生姓名
        // 获取错误提示，其在alert()函数内
        let errText = $('#form1 script').html()
        // 提取alert(函数内的文字)
        let reg = /'([^']*)'/
        // 执行正则表达式提取错误信息
        let loginFailInfo = reg.exec(errText)[1]
        // 返回错误提示
        ctx.state = {
            code: 0,
            data: '教务' + loginFailInfo
        }
    } else {
        // 登录成功
        // 移除学生姓名后缀的“同学”
        studentName = studentName.replace('同学', '')
        // 获取文档中有关学号的内容
        let studyNumber = $('form[name=Form1]').attr('action')
        // 将学号前的跳转连接去除
        studyNumber = studyNumber.replace('xs_main.aspx?xh=', '')
        // 继续执行登录中间件
        await next()
        // 通过OpenId将用户教务系统的cookies写入数据库
        const openId = ctx.state.$wxInfo.userinfo.userinfo.openId
        await updateUserInfo(openId, jwCookies)
        // 返回带有学号和姓名的个人信息
        Object.assign(ctx.state.data.userinfo, { sno: studyNumber, sname: studentName })
    }
}

// 该函数用于发送登录请求。因为教务系统使用GB-2312编码，所以无法使用封装函数。
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

// 该函数用于将用户的教务系统Cookies保存到数据库中
async function updateUserInfo (openId, cookies) {
    await mysql('cSessionInfo').where('open_id', '=', openId).update({
        'jw_cookies': cookies
    })
}
