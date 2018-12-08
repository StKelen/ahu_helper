<template>
    <div>
        <img id="avatar" :src="userInfo.avatarUrl" alt="头像">
        <div v-if="!userInfo.openId">
            <div class="input-area">
                <input type="text" id="study-number" placeholder="学号" @input="getStudyNumber">
            </div>
            <div class="input-area">
                <input type="text" password=true id="password" placeholder="校园卡查询密码"  @input="getPassword">
            </div>
            <div class="input-area">
                <input type="text" id="serial-number" placeholder="验证码"  @input="getSerialNumber">
                <img :src="checkCodeUrl" alt="验证码">
            </div>
            <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onLogin">登录</button>
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
            serialNumber: ''
        }
    },
    methods: {
        async getPicAndCookie () {
            const data = await get('/weapp/get_check_code')
            this.checkCodeUrl = 'data:image/png;base64,' + data.PictureAndCookie.image
            this.cookie = data.PictureAndCookie.cookie
        },
        onLogin () {
            login.setLoginUrl(config.loginUrl)
            login.login({
                success: (userInfo) => {
                    console.log(this.userInfo)
                    this.userInfo = userInfo
                    wx.setStorageSync('userInfo', userInfo)
                },
                fail: (err) => {
                    console.log('登录失败', err)
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
    }
}
</script>

<style scoped>
#avatar {
    display: block;
    width: 200rpx;
    height: 200rpx;
    margin: 150rpx auto;
    border-radius: 100rpx;
}
.input-area {
    height: 80rpx;
    width: 80%;
    margin: 50rpx auto;
}
input {
    height: 100%;
    padding-left: 120rpx;
    padding-right: 40rpx;
    font-size: 40rpx;
    font-weight: light;
    color: #888;
    background-color: #FFF;
    background-size: 60rpx 60rpx;
    background-repeat: no-repeat;
    background-position: 30rpx center;
    box-shadow: 0rpx 0rpx 15rpx #DFDFDF inset;
    border-radius: 40rpx;
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
    width: 210rpx;
    height: 80rpx;
}
button {
    width: 70%;
    height: 80rpx;
    background-color: rgb(255, 201, 0);
    color: #FFF;
    font-weight: bold;
    border-radius: 20rpx;
}
</style>
