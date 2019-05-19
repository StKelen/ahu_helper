const {
    mysql
} = require('../qcloud')
const config = require('../config')

// 该模块用于获取主页列表
module.exports = async (ctx) => {
    // 向数据库查询目前所有的列表
    const list = await mysql('indexList').select('*')
    // 返回列表
    if (config.canIPay) {
        ctx.state.data = list
    } else {
        ctx.state.data = list.slice(4)
    }
}
