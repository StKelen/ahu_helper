<script>
// import {get} from './util'
import config from './config'
import qcloud from 'wafer2-client-sdk'

export default {
    async created () {
        // 调用API从本地缓存中获取数据
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        console.log('app created and cache logs by setStorageSync')

        qcloud.setLoginUrl(config.loginUrl)
        qcloud.login({
            success: function (userInfo) {
                console.log('登录成功', userInfo)
            }
        }, {
            fail: function (err) {
                console.log('登录失败', err)
            }
        })
    }
}
</script>

<style>
page{
    background-color: #F4F7FC;
}
</style>
