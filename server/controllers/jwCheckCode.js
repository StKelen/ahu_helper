const config = require('../config')
const sendRequest = require('../utils/sendRequest')
const cheerio = require('cheerio')

module.exports = {
    getPicAndCookie: async ctx => {
        const requestData = await sendRequest(config.jwUrl, {})
        if (requestData.code === -2) return requestData
        let $ = cheerio.load(requestData.text)
        const viewState = $('input[name=__VIEWSTATE]').attr('value')
        const viewStateGenerator = $('input[name=__VIEWSTATEGENERATOR]').attr('value')
        // 从返回数据获取头文件中的cookies
        const cookie = String(requestData.headers['set-cookie'][0]).replace(/; path=\//, '')
        const headers = {
            cookie
        }
        const checkImage = await sendRequest(config.jwCheckImage, headers)
        if (checkImage.code === -2) return checkImage
        ctx.state.data = {
            jwImg: checkImage.body.toString('base64'),
            cookie,
            viewState,
            viewStateGenerator
        }
    },
    getPic: async ctx => {
        const Cookie = ctx.query['cookies']
        const headers = {
            Cookie
        }
        const picData = await sendRequest(config.jwCheckImage, headers)
        ctx.state.data = picData.body.toString('base64')
    }
}
