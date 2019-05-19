// 该模块用于计算当前是教学安排的第几周
module.exports = async ctx => {
    const date = new Date()
    // getTime()用于获取从1970年1月1日至今所经过的毫秒数。
    // week获取从那时至今的周数
    let week = date.getTime() / 1000 / 60 / 60 / 24 / 7
    // 取整并计算当前教学周数
    week = parseInt(week) - 2562
    // 返回周数
    ctx.state.data = week
}
