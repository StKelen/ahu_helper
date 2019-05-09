const agent = require('superagent')
module.exports = async (url, headers, isForm, data) => {
    if (isForm) {
        let returnData
        try {
            returnData = await new Promise((resolve, reject) => {
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
