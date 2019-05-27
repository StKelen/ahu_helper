// 个人信息页面
<template>
    <div class="person-page">
        <!-- 个人头像 -->
        <div class="avatar-content">
            <img id="avatar" :src="userInfo.avatarUrl" alt="头像">
        </div>
        <!-- 相关信息 -->
        <div class="person-content">
            <ul class="person-list" v-if="studentInfo">
                <li>姓名：　　　{{studentInfo.name}}</li>
                <li>校园卡卡号：{{studentInfo.studyNum}}</li>
                <li>校园卡类型：{{studentInfo.cardName}}</li>
                <li>校园卡余额：{{studentInfo.remainBalance/100}}元</li>
                <li>过渡余额：　{{studentInfo.comingBalance/100}}元</li>
            </ul>
        </div>
    </div>
</template>

<script>
import config from '@/config'
import {get} from '@/utils/util'
export default {
    data () {
        return {
            // 默认的用户信息只有默认的用户头像
            userInfo: {
                avatarUrl: `${config.personUrl}/avatar.png`
            },
            // 校园卡相关信息
            studentInfo: {}
        }
    },
    methods: {
        // 通过获取微信个人信息来获取校园卡信息
        async getStudentInfo () {
            const userInfo = wx.getStorageSync('userInfo')
            this.userInfo = userInfo
            const openId = userInfo.openId
            this.studentInfo = (await get(
                '/weapp/user_info' + `?open_id=${openId}&id=${this.id}`
            )).data
        }
    },
    async onLoad () {
        wx.showLoading({ title: '加载中' })
        await this.getStudentInfo()
        wx.hideLoading()
    }
}
</script>

<style scoped>
/* 顶部头像样式 */
#person-page{
    position: relative;
}
.avatar-content{
    position: relative;
    display: block;
    width: 220rpx;
    height: 220rpx;
    margin: 120rpx auto 0 auto;
    border-radius: 100rpx;
    z-index: 1;
    background-color: #FFF;

}
#avatar {
    width: 200rpx;
    height: 200rpx;
    margin: 10rpx;
    border-radius: 100rpx;
}
/* 个人信息样式 */
.person-content{
    position: relative;
    width: 80%;
    margin: auto;
    margin-top: -120rpx;
    padding-top: 100rpx;
    padding-bottom: 100rpx;
    border-radius: 30rpx;
    z-index: 0;
    background-color: #FFF;
    box-shadow: 0 0 40rpx 30rpx rgba(225, 225, 225, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
}
/* 个人信息列表样式 */
.person-list{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 75rpx;
}
.person-list li{
    padding: 15rpx 25rpx;
    height: 45rpx;
    font-size: 32rpx;
    color: #999;
}
</style>
