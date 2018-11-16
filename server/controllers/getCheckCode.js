const crawler = require('../utils/getSerialPicture')
const config = require('../config')

module.exports = async (ctx) => {
    const PictureAndCookie = await crawler(config)
    ctx.state.data = {
        PictureAndCookie
    }
}
