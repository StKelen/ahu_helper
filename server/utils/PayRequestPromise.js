const agent = require('superagent')

module.exports = async (url, cookies, data, isForm) => {
    const headers = {
        Cookie: cookies,
        Connection: 'keep-alive',
        Origin: 'http://101.76.160.144',
        Referer: 'http://101.76.160.144/Page/Page',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    if (isForm) {
        return new Promise((resolve, reject) => {
            agent
                .post(url)
                .set(headers)
                .send(data)
                .type('form')
                .end((err, result) => {
                    if (err) {
                        reject({
                            'code': 0,
                            desc: '服务器连接失败'
                        })
                    }
                    resolve(result)
                })
        })
    } else {
        return new Promise((resolve, reject) => {
            agent
                .post(url)
                .set(headers)
                .send(data)
                .end((err, result) => {
                    if (err) {
                        reject({
                            'code': 0,
                            desc: '服务器连接失败'
                        })
                    }
                    resolve(result)
                })
        })
    }
}
