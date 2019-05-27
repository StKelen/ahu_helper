// 工具类函数，包含了get、post和验证登录信息是否有效的封装
import config from '../config'

// 发送Get请求的封装
export async function get (url) {
    let returnData
    let timer = 0
    let isSuccess = false
    // 由于SSL验证问题，会尝试在第一次请求失败时再次发送请求，5次后仍未成功再判断请求失败
    while (!isSuccess && timer < 5) {
        try {
            returnData = await new Promise((resolve, reject) => {
                wx.request({
                    url: config.host + url,
                    success: function (res) {
                        if (res && res.statusCode === 200 && res.data) {
                            // 成功发送请求，结束循环
                            resolve(res.data)
                            isSuccess = true
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
        timer++
    }
    // 判断网络问题还是支付系统问题
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

// 发送Post请求的封装，原理和Get类似
export async function post (url, data) {
    let returnData
    let timer = 0
    let isSuccess = false
    // 由于SSL验证问题，会尝试在第一次请求失败时再次发送请求，5次后仍未成功再判断请求失败
    while (!isSuccess && timer < 5) {
        try {
            returnData = await new Promise((resolve, reject) => {
                wx.request({
                    url: config.host + url,
                    method: 'POST',
                    data,
                    complete: function (res) {
                        if (res && res.statusCode === 200 && res.data) {
                            // 成功发送请求，结束循环
                            resolve(res.data)
                            isSuccess = true
                        }
                        reject(new Error('网络连接失败'))
                    }
                })
            })
        } catch (e) {
            returnData = new Error('网络连接失败')
        }
        timer++
    }
    // 判断网络问题还是支付系统问题
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

// 该函数用于验证支付系统登录信息是否仍然有效
export async function userValid () {
    // 获取OpenID并发送验证请求
    let openId = wx.getStorageSync('userInfo').openId
    if (openId) {
        let valid = await post('/weapp/check_valid', {
            openId
        })
        // 服务器端返回验证结果，为Boolean类型
        valid = valid.data.valid
        // 如果个人信息过期。自动删除旧信息，跳转至个人中心重新登录
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
        // 未登录状态，要求登录
        wx.reLaunch({
            url: '/pages/person/main?notice=请登录~'
        })
    }
}
