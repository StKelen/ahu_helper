module.exports = async ctx => {
    const date = new Date()
    let week = date.getTime() / 1000 / 60 / 60 / 24 / 7
    week = parseInt(week) - 2562
    ctx.state.data = week
}
