const {getSerialPictureCookie, getPicture} = require('../utils/getSerialPicture')
const config = require('../config')

module.exports = {
    getPicWithoutCookie: async (ctx) => {
        const PictureAndCookie = await getSerialPictureCookie(config)
        ctx.state = PictureAndCookie
    },
    getPicWithCookie: async(ctx) => {
        const cookies = ctx.query['cookies']
        const Pic = await getPicture(config, cookies)
        ctx.state = Pic
    }
}
