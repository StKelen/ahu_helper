// 该模块用于将Ajax请求的数据返回并处理为可以使用的对象
module.exports = data => {
    return JSON.parse((JSON.parse(data.text)).Msg)
}
