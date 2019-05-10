const agent = require('superagent')

// 该模块负责对所有发送请求进行封装
module.exports = async (url, headers, isForm, data) => {
    // isForm判断数据是否需要发送为表格格式，这对data的编码有影响
    if (isForm) {
        let returnData
        try {
            returnData = await new Promise((resolve, reject) => {
                // 使用SuperAgent模块，设置发送的Url，头文件headers，数据体data和将Data处理为表单
                agent
                    .post(url)
                    .set(headers)
                    .send(data)
                    .type('form')
                    .end((err, result) => {
                        if (err) {
                            reject(new Error('服务器连接失败'))
                        }
                        resolve(result)
                    })
            })
        } catch (e) {
            // 服务器无法连接
            returnData = {
                'code': -2,
                'data': {
                    'desc': '服务器连接失败'
                }
            }
        }
        return returnData
    } else {
        let returnData
        try {
            returnData = await new Promise((resolve, reject) => {
                // 使用SuperAgent模块，设置发送的Url，头文件headers，数据体data
                agent
                    .post(url)
                    .set(headers)
                    .send(data)
                    .end((err, result) => {
                        if (err) {
                            reject(new Error('服务器连接失败'))
                        }
                        resolve(result)
                    })
            })
        } catch (e) {
            // 服务器无法连接
            returnData = {
                'code': -2,
                'data': {
                    'desc': '服务器连接失败'
                }
            }
        }
        return returnData
    }
}
