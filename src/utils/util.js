import config from '../config'

export async function get (url) {
    let returnData
    try {
        returnData = await new Promise((resolve, reject) => {
            wx.request({
                url: config.host + url,
                success: function (res) {
                    if (res && res.data) {
                        resolve(res.data)
                    } else {
                        reject(new Error('网络连接失败'))
                    }
                },
                fail: function () {
                    resolve(new Error('网络连接失败'))
                }
            })
        })
    } catch (e) {
        returnData = new Error('网络连接失败')
    }
    if (returnData instanceof Error) {
        wx.showToast({
            title: '无网络连接',
            icon: 'none',
            image: '/static/images/warning.png',
            mask: true
        })
        returnData = {
            code: -1,
            data: '网络连接失败'
        }
    }
    if (returnData.code === -2) {
        wx.showToast({
            title: '支付系统错误',
            icon: 'none',
            image: '/static/images/warning.png',
            mask: true
        })
    }
    return returnData
}

export async function post (url, data) {
    let returnData
    try {
        returnData = await new Promise((resolve, reject) => {
            wx.request({
                url: config.host + url,
                method: 'POST',
                data,
                complete: function (res) {
                    if (res && res.data) {
                        resolve(res.data)
                    }
                    reject(new Error('网络连接失败'))
                }
            })
        })
    } catch (e) {
        returnData = new Error('网络连接失败')
    }
    if (returnData instanceof Error) {
        wx.showToast({
            title: '无网络连接',
            icon: 'none',
            image: '/static/images/warning.png',
            mask: true
        })
        returnData = {
            code: -1,
            data: '网络连接失败'
        }
    }
    if (returnData.code === -2) {
        wx.showToast({
            title: '支付系统错误',
            icon: 'none',
            image: '/static/images/warning.png',
            mask: true
        })
    }
    return returnData
}

export async function userValid () {
    let openId = wx.getStorageSync('userInfo').openId
    if (openId) {
        let valid = await post('/weapp/check_valid', {
            openId
        })
        valid = valid.data.valid
        if (!valid) {
            try {
                wx.clearStorageSync('userInfo')
            } catch (err) {

            }
            wx.reLaunch({
                url: '/pages/person/main?notice=登录信息已过期~'
            })
        }
    } else {
        wx.reLaunch({
            url: '/pages/person/main?notice=请登录~'
        })
    }
}
