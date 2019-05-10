const {
    mysql
} = require('../qcloud')

// 该模块用于获取主页列表
module.exports = async (ctx) => {
    // 向数据库查询目前所有的列表
    const list = await mysql('indexList').select('*')
    // 返回列表
    ctx.state.data = list
}
