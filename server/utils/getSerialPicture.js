const sendRequest = require('./sendRequest')

async function getSerialPictureCookie (config) {
    const cookie = await getSessionId(config.hallUrl)
    if (cookie.code === -2) return cookie
    const imageBuffer = await getSerialPicture(config.hallUrl, cookie)
    if (cookie.code === -2) return imageBuffer
    return {
        code: 0,
        data: {
            image: imageBuffer.toString('base64'),
            cookie
        }
    }
}

async function getPicture (config, cookie) {
    const imageBuffer = await getSerialPicture(config.hallUrl, cookie)
    return {
        image: imageBuffer.toString('base64'),
        cookie
    }
}

async function getSessionId (url) {
    const requestData = await sendRequest(url, {})
    if (requestData.code === -2) return requestData
    const cookie = String(requestData.headers['set-cookie'][0]).replace(/; path=\/; HttpOnly/, '')
    return cookie
}

async function getSerialPicture (url, cookie) {
    const headers = {
        cookie
    }
    const requestData = await sendRequest(url + '/Login/GetValidateCode', headers, false)
    if (requestData.code === -2) return requestData
    return requestData.body
}

module.exports = {
    getSerialPictureCookie,
    getPicture
}
