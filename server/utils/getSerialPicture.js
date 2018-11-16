const agent = require('superagent')

async function getSerialPicture (config) {
    if ([config.hallUrl].some(v => v === undefined)) throw Error('服务大厅网址没有定义')
    const cookie = await getSessionIdPromise(config.hallUrl)
    const imageBuffer = await getSerialPicturePromise(config.hallUrl, cookie)
    return { image: imageBuffer.toString('base64'), cookie }
}

function getSessionIdPromise (url) {
    return new Promise((resolve, reject) => {
        agent.post(url).end((err, res) => {
            if (err) reject(err)
            const cookie = String(res.headers['set-cookie'][0]).replace(/; path=\/; HttpOnly/, '')
            resolve(cookie)
        })
    })
}

function getSerialPicturePromise (url, cookie) {
    const headers = { cookie }
    return new Promise((resolve, reject) => {
        agent.post(url + 'Login/GetValidateCode')
      .set(headers)
      .end((err, res) => {
          if (err) reject(err)
          resolve(res.body)
      })
    })
}

module.exports = getSerialPicture
