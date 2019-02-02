<template>
    <div class="person-page">
        <div class="avatar-content">
            <img id="avatar" :src="userInfo.avatarUrl" alt="头像">
        </div>
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
            userInfo: {
                avatarUrl: `${config.personUrl}avatar.png`
            },
            studentInfo: {}
        }
    },
    methods: {
        getUserInfo () {
            const userInfo = wx.getStorageSync('userInfo')
            if (userInfo.openId) {
                this.userInfo = userInfo
            } else {
                this.userInfo = {
                    avatarUrl: `${config.personUrl}avatar.png`
                }
            }
        },
        async getStudentInfo () {
            const openId = wx.getStorageSync('userInfo').openId
            this.studentInfo = await get(
                '/weapp/user_info' + `?open_id=${openId}&id=${this.id}`
            )
            console.log(this.studentInfo)
        }
    },
    onShow () {
        this.getUserInfo()
    },
    async mounted () {
        await this.getStudentInfo()
    }
}
</script>

<style scoped>
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
