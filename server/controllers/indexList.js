const {mysql} = require('../qcloud')
module.exports = async (ctx) => {
    const list = await mysql('indexList').select('*')
    ctx.state.data = {
        list
    }
}
