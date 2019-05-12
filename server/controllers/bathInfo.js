module.exports = ctx => {
    const dateObj = new Date()
    const day = parseInt((dateObj.getTime()) / 1000 / 60 / 60 / 24)
    console.log(day)
    const returnData = {
        today: {
            man: day % 2 === 0 ? ['北区浴室'] : ['南区浴室', '蕙园浴室'],
            woman: day % 2 === 0 ? ['南区浴室', '蕙园浴室'] : ['北区浴室']
        },
        tomorrow: {
            man: day % 2 === 1 ? ['北区浴室'] : ['南区浴室', '蕙园浴室'],
            woman: day % 2 === 1 ? ['南区浴室', '蕙园浴室'] : ['北区浴室']
        }
    }
    ctx.state.data = returnData
}
