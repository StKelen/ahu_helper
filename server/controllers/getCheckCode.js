const { getSerialPictureCookie, getPicture } = require('../utils/getSerialPicture')
const config = require('../config')

// 该模块用于获取用户有关验证码图片的处理
module.exports = {
    // 如果没有Cookies，则先获取Cookies再获取验证码图片
    getPicWithoutCookie: async (ctx) => {
        const PictureAndCookie = await getSerialPictureCookie(config)
        ctx.state = PictureAndCookie
    },
    // 如果已经有了Cookies，直接通过Cookies获取图片
    getPicWithCookie: async (ctx) => {
        const cookies = ctx.query['cookies']
        const Pic = await getPicture(config.hallUrl, cookies)
        ctx.state.data = Pic
    }
}
