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

export async function userValid () {
    let openId = wx.getStorageSync('userInfo').openId
    if (openId) {
        let valid = await post('/weapp/check_valid', {openId})
        valid = valid.data.data.valid
        if (!valid) {
            try {
                wx.clearStorageSync('userInfo')
            } catch (err) {

            }
            wx.reLaunch({url: '/pages/person/main?notice=登录信息已过期~'})
        }
    } else {
        wx.reLaunch({url: '/pages/person/main?notice=请登录~'})
    }
}
