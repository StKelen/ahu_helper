const {mysql} = require('../qcloud')

// 该模块用于从数据库获取支付系统相关参数
module.exports = async id => {
    // 向数据库发起查询请求
    const formValuesArray = await mysql('paymentInfo').select('*').where('id', '=', id)
    // 默认只有一个支付参数对应，只获取第一个
    const formValues = formValuesArray[0]
    // id不再需要，直接删除
    delete formValues.id
    // 返回支付参数
    return formValues
}
