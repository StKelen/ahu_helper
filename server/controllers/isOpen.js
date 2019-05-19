const config = require('../config')
module.exports = ctx => {
    ctx.state.data = config.canIPay
}
