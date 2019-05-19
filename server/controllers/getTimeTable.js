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
    // 通过客户端发起的请求获取用户的学号
    const sno = ctx.query['sno']
    // 通过客户端发起的请求获取用户的姓名
    const sname = ctx.query['sname']
    // 通过OpenId从数据库获取用户的个人信息
    const cookies = await getJwCookies(openId)
    // 设置教务系统请求头
    const headers = {
        'Host': 'jw2.ahu.cn',
        'Upgrade-Insecure-Requests': 1,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'http://jw2.ahu.cn/xs_main.aspx?xh=' + sno,
        'Cookie': cookies
    }
    // 将学生姓名进行转换为GBK的URL编码
    const nameGBK = parseUtf2GBK(sname)
    // 设置请求链接
    const url = `${config.jwTableUrl}?xh=${sno}&xm=${nameGBK}&gnmkdm=N121603`
    // 发送教务系统请求
    let returnData
    try {
        returnData = await sendRequsetPromise(url, headers)
    } catch (e) {
        ctx.state = {
            'code': -2,
            'data': {
                'desc': '服务器连接失败'
            }
        }
    }
    // 对页面的信息进行提取，获取课程列表
    const list = parsePageToObj(returnData.text)
    // 返回课程列表
    ctx.state.data = list
}

// 该函数用于通过OpenId来获取用户的教务系统Cookies
async function getJwCookies (openId) {
    let cookies = await mysql('cSessionInfo').select('jw_cookies').where('open_id', '=', openId)
    return cookies[0]['jw_cookies']
}

// 该函数用于将字符串转化为GB-2312的一个url格式编码
function parseUtf2GBK (str) {
    // 先将字符串转化为GB-2312的二进制数据
    const strBuffer = iconv.encode(str, 'gbk')
    // 将数据以16位的方式显示出来，如“071c5d8a”
    const strHex = strBuffer.toString('hex')
    // 在每两个数字之前加一个百分号，如“%07%1c%5d%8a”
    const gbkStr = replaceStr(strHex)
    // 返回完成的编码
    return gbkStr
}

// 该函数用于在每两个字符前插入一个%
function replaceStr (str) {
    return str.replace(/(.{2})/g, '%$1')
}

// 该函数用于以GB-2312的方式发送编码
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

// 该函数用于将中文大写的“一、二、三、四、五、六、七”转化为阿拉伯数字的“1、2、3、4、5、6、7”
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

// 该函数用于将页面进行解析，获取课程信息
function parsePageToObj (html) {
    // 通过cheerio模块加载文档
    let $ = cheerio.load(html, { decodeEntities: false })
    // 设置课程数组列表
    const list = []
    // 对文档中的每一个单元格进行处理
    $('td').each((index, element) => {
        let $element = $(element)
        // 获取单元格内的HTML原文内容
        let lesson = $element.html()
        // 判断原文件是否有<br>换行，如果没有，可能是课表其它组件，不予提取。如果有，则是课程信息
        if ($element.find('br').length) {
            // 在同一个课程时间内，是否有多个课程（可能周数不同）
            let lessonsOnSameTime = []
            // 同意时间的不同课程用<br><br>分隔，可以将他们提取到数组中
            if (lesson.indexOf('<br><br>') !== -1) {
                lessonsOnSameTime = lesson.split('<br><br>')
            } else {
                // 该时间段一直只有一个课
                lessonsOnSameTime.push(lesson)
            }
            // 对每一节课进行处理
            lessonsOnSameTime.forEach((item, index) => {
                // 课程的名字、上课时间、教师、地点由“<br>”进行分隔。将一个课程的信息分隔并加入数组，数组前4项与之对应
                const oneLessonArr = item.split('<br>')
                // 将时间字符串提取为信息
                const timeArrange = parseTimeToArrange(oneLessonArr[1])
                // 将时间信息和其它信息组合为一个新对象
                const lessonObj = Object.assign({
                    // 课程名称
                    name: oneLessonArr[0],
                    // 课程教师
                    teacher: oneLessonArr[2],
                    // 上课地点，将名称简化
                    position: oneLessonArr[3].replace('博学北楼', '博北').replace('博学南楼', '博南').replace('行知楼', '行知').replace('笃行南楼', '笃南').replace('笃行北楼', '笃北')
                }, timeArrange)
                // 将处理好的对象加入课程列表数组中
                list.push(lessonObj)
            })
        }
    })
    // 返回数组
    return list
}

// 该函数用于将课程时间字符串转换为对象
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
