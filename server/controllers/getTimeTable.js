const iconv = require('iconv-lite')
const {
    mysql
} = require('../qcloud')
const config = require('../config')
const agent = require('superagent')
require('superagent-charset')(agent)
const cheerio = require('cheerio')

module.exports = async ctx => {
    // 通过客户端发起的请求获取用户的OpenID
    const openId = ctx.query['open_id']
    const sno = ctx.query['sno']
    const sname = ctx.query['sname']
    const cookies = await getJwCookies(openId)
    const headers = {
        'Host': 'jw2.ahu.cn',
        'Upgrade-Insecure-Requests': 1,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'http://jw2.ahu.cn/xs_main.aspx?xh=' + sno,
        'Cookie': cookies
    }
    const nameBuffer = iconv.encode(sname, 'gbk')
    const nameHex = nameBuffer.toString('hex')
    const nameUri = replaceStr(nameHex)
    const url = `${config.jwTableUrl}?xh=${sno}&xm=${nameUri}&gnmkdm=N121603`
    const returnData = await sendRequsetPromise(url, headers)
    let $ = cheerio.load(returnData.text, {
        decodeEntities: false
    })
    const list = []
    $('td').each((index, element) => {
        let $element = $(element)
        let lesson = $element.html()
        if ($element.find('br').length) {
            let lessonsOnSameTime = []
            if (lesson.indexOf('<br><br>') !== -1) {
                lessonsOnSameTime = lesson.split('<br><br>')
            } else {
                lessonsOnSameTime.push(lesson)
            }
            lessonsOnSameTime.forEach((item, index) => {
                const oneLessonArr = item.split('<br>')
                const timeArrange = parseTimeToArrange(oneLessonArr[1])
                const lessonObj = Object.assign({
                    name: oneLessonArr[0],
                    teacher: oneLessonArr[2],
                    position: oneLessonArr[3]
                }, timeArrange)
                list.push(lessonObj)
            })
        }
    })
    ctx.state.data = list
}

async function getJwCookies (openId) {
    let cookies = await mysql('cSessionInfo').select('jw_cookies').where('open_id', '=', openId)
    return cookies[0]['jw_cookies']
}

function replaceStr (str) {
    return str.replace(/(.{2})/g, '%$1')
}

async function sendRequsetPromise (url, headers) {
    return new Promise((resolve, reject) => {
        agent.get(url)
            .set(headers)
            .charset('gbk')
            .end((err, result) => {
                if (err) reject(err)
                resolve(result)
            })
    })
}

function parseChineseToNum (str) {
    switch (str) {
        case '一':
            return 1
        case '二':
            return 2
        case '三':
            return 3
        case '四':
            return 4
        case '五':
            return 5
        case '六':
            return 6
        case '日':
            return 7
        default:
            return 0
    }
}

function parseTimeToArrange (str) {
    // str为传入的课程时间字符串，形如：“周日第9,10,11节{第1-18周}”
    // 获取“节”字符所在的位置
    const posOfJie = str.indexOf('节')
    // 课程时间段从第4个字符串开始，到“节”结束，截取上课时间，如截取出“9,0,11”
    const timeStr = str.substring(3, posOfJie)
    // 将上课时间段分割为数组
    const lessonsTime = timeStr.split(',')
    // 数组的第一个元素为课程开始时间，将其转换为数字
    const startLesson = parseInt(lessonsTime[0])
    // 数组的长度即为课程的节数
    const lessonLength = lessonsTime.length
    // 获取课程开始周数字符的位置
    const posOfStartWeek = str.indexOf('{第') + 2
    // 获取课程结束周数字符的位置
    const posOfEndWeek = str.indexOf('周}')
    // 获取课程开始和结束周数之间“-”的位置
    const posOfweekJoin = str.indexOf('-')
    // 获取课程开始周数，并将其转换为数值
    const startWeek = parseInt(str.substring(posOfStartWeek, posOfweekJoin))
    // 获取课程结束周数，并将其转换为数值
    const endWeek = parseInt(str.substring(posOfweekJoin + 1, posOfEndWeek))
    // 字符串第二个为周几上课，获取并将其转换为数值
    const week = parseChineseToNum(str[1])
    return {
    // 第几周上课
        week,
        // 第几节课开始
        startLesson,
        // 上几节课
        lessonLength,
        // 课程开始周数
        startWeek,
        // 课程结束周数
        endWeek
    }
}
