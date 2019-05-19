const {
    mysql
} = require('../qcloud')
module.exports = async ctx => {
    const passingList = await mysql('classInfo').select('name', 'code', 'nature', 'academy', 'less_sixty', 'sixty_seventy', 'seventy_eighty', 'eighty_ninety', 'ninety_hundred')
    ctx.state.data = passingList
}
