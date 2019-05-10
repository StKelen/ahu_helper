const sendRequest = require('./sendRequest')

// 该模块用于处理验证码图片相关请求
module.exports = {
    getSerialPictureCookie,
    getPicture
}

// 该函数用于获取cookies和验证码图片
async function getSerialPictureCookie (config) {
    // 发起请求，获取登录cookies
    const cookie = await getSessionId(config.hallUrl)
    // 判断支付系统是否可以相响应
    if (cookie.code === -2) return cookie
    // 通过cookies获取验证码图片
    const imageBuffer = await getSerialPicture(config.hallUrl, cookie)
    // 判断支付系统是否可以响应
    if (cookie.code === -2) return imageBuffer
    // 返回验证码图片
    return {
        code: 0,
        data: {
            // 将图片由二进制数据进行Base64编码，方便传输
            image: imageBuffer.toString('base64'),
            // 发送登录凭据
            cookie
        }
    }
}

// 传入页面网址、cookies，获取验证码图片
async function getPicture (url, cookie) {
    // 获取图片的二进制图片
    const imageBuffer = await getSerialPicture(url, cookie)
    // 返回验证码图片
    return {
        image: imageBuffer.toString('base64'),
        cookie
    }
}

// 首次登录网站，获取cookies
async function getSessionId (url) {
    // 发起访问网络请求
    const requestData = await sendRequest(url, {})
    // 判断支付系统是否可以相应
    if (requestData.code === -2) return requestData
    // 从返回数据获取头文件中的cookies
    const cookie = String(requestData.headers['set-cookie'][0]).replace(/; path=\/; HttpOnly/, '')
    return cookie
}

// 通过cookies来获取验证码图片
async function getSerialPicture (url, cookie) {
    // 将cookies加入到头文件
    const headers = {
        cookie
    }
    // 发送获取验证码图片请求
    const requestData = await sendRequest(url + '/Login/GetValidateCode', headers, false)
    // 判断支付系统是否可以响应
    if (requestData.code === -2) return requestData
    return requestData.body
}
