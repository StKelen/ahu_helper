<script>
// import {get} from './util'

export default {
    async created () {
        // 调用API从本地缓存中获取数据
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        console.log('app created and cache logs by setStorageSync')
    }
}
</script>

<style>
page{
    background-color: #F4F7FC;
}
</style>
