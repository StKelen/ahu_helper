import config from '../config'

export function get (url) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            success: function (res) {
                if (res.data.code === 0) {
                    resolve(res.data.data)
                } else {
                    reject(res.data)
                }
            }
        })
    })
}

export function post (url, data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            method: 'POST',
            data,
            complete: function (res) {
                if (res || res.data)resolve(res)
                reject(res)
            }
        })
    })
}
