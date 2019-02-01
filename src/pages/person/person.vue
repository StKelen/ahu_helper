<template>
    <div class="person-page">
        <div class="avatar-content">
            <img id="avatar" :src="userInfo.avatarUrl" alt="头像">
        </div>
        <div v-if="!userInfo.openId" class="input-field">
            <div class="input-area">
                <input type="text" id="study-number" placeholder="学号" @input="getStudyNumber">
            </div>
            <div class="input-area">
                <input type="text" password=true id="password" placeholder="校园卡查询密码"  @input="getPassword">
            </div>
            <div class="input-area">
                <input type="text" id="serial-number" placeholder="验证码"  @input="getSerialNumber">
                <img :src="checkCodeUrl" alt="验证码" @click="getPic">
            </div>
            <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onLogin">登　录</button>
        </div>
    </div>
</template>

<script>
import config from '@/config'
import {get} from '@/utils/util'
import login from '@/utils/login'
export default {
    data () {
        return {
            userInfo: {
                avatarUrl: `${config.personUrl}avatar.png`
            },
            checkCodeUrl: '',
            cookie: '',
            studyNumber: '',
            password: '',
            serialNumber: '',
            notice: ''
        }
    },
    methods: {
        async getPicAndCookie () {
            const data = await get('/weapp/get_check_code_cookie')
            this.checkCodeUrl = 'data:image/png;base64,' + data.image
            this.cookie = data.cookie
        },
        async getPic () {
            const data = await get(`/weapp/get_check_code?cookies=${this.cookie}`)
            this.checkCodeUrl = 'data:image/png;base64,' + data.image
        },
        onLogin () {
            login.setLoginUrl(config.loginUrl)
            login.login({
                success: (userInfo) => {
                    this.userInfo = userInfo
                    wx.setStorageSync('userInfo', userInfo)
                    wx.showToast({
                        title: '登录成功',
                        icon: 'none',
                        image: '/static/images/success.png',
                        mask: true
                    })
                },
                fail: (err) => {
                    wx.showToast({
                        title: err,
                        icon: 'none',
                        image: '/static/images/warning.png',
                        mask: true
                    })
                },
                studyNumber: this.studyNumber,
                password: this.password,
                serialNumber: this.serialNumber,
                cookie: this.cookie
            })
        },
        getUserInfo () {
            const userInfo = wx.getStorageSync('userInfo')
            if (userInfo.openId) {
                this.userInfo = userInfo
            }
        },
        getStudyNumber (e) {
            this.studyNumber = e.mp.detail.value
        },
        getPassword (e) {
            this.password = e.mp.detail.value
        },
        getSerialNumber (e) {
            this.serialNumber = e.mp.detail.value
        }
    },
    onLoad () {
        this.getUserInfo()
    },
    mounted () {
        if (!this.userInfo.openId) {
            this.getPicAndCookie()
        }
        this.notice = this.$root.$mp.query.notice
        if (this.notice) {
            wx.showToast({
                title: this.notice,
                icon: 'none',
                image: '/static/images/info.png',
                mask: true
            })
        }
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
.input-field{
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
.input-area {
    height: 80rpx;
    width: 80%;
    margin: 50rpx auto;
}
input {
    height: 100%;
    padding-left: 70rpx;
    font-size: 40rpx;
    font-weight: light;
    color: #999;
    background-size: 40rpx 40rpx;
    background-repeat: no-repeat;
    background-position: 10rpx center;
    border-bottom: 2rpx solid #CCC;
}
#study-number {
    background-image:  url('../../../static/images/card.png');
}
#password {
    background-image:  url('../../../static/images/password.png');
}
#serial-number {
    background-image:  url('../../../static/images/checkcode.png');
    display: inline-block;
    width: 28%;
}
.input-area img {
    float: right;
    width: 180rpx;
    height: 70rpx;
    margin-right: 40rpx;
}
button {
    width: 70%;
    height: 80rpx;
    line-height: 70rpx;
    font-size: 40rpx;
    background-image: linear-gradient(
        45deg,
        #FFD511 20%,
        #F8A508
    ); 
    background-color: #F8A508;
    color: #333;
    border-radius: 40rpx;
}
button::after{
    border: none;
}
</style>
