<template>
    <div class="person-page">
        <div class="avatar-content">
            <img :src="userInfo.avatarUrl" alt="头像" id="avatar">
        </div>
        <div class="person-content">
            <div class="input-field" v-if="!userInfo.openId">
                <div class="input-area">
                    <input @input="getStudyNumber" id="study-number" placeholder="学号" type="text">
                </div>
                <div class="input-area" v-if="canUse">
                    <input
                        @input="getPassword"
                        id="password"
                        password="true"
                        placeholder="校园卡查询密码"
                        type="text"
                    >
                </div>
                <div class="input-area">
                    <input
                        @input="getJwPassword"
                        id="jw-password"
                        password="true"
                        placeholder="教务系统密码"
                        type="text"
                    >
                </div>
                <div class="input-area" v-if="canUse">
                    <input
                        @input="getSerialNumber"
                        id="serial-number"
                        placeholder="验证码"
                        type="text"
                    >
                    <img :src="checkCodeUrl" @click="getPic" alt="验证码">
                </div>
                <div class="input-area">
                    <input
                        @input="getJwSerialNumber"
                        id="jw-serial-number"
                        placeholder="验证码"
                        type="text"
                    >
                    <img :src="jwCheckCodeUrl" @click="getJwPic" alt="验证码">
                </div>
                <button @getuserinfo="onLogin" lang="zh_CN" open-type="getUserInfo">登 录</button>
            </div>
            <div v-else>
                <ul class="person-list">
                    <a href="/pages/personInfo/main">
                        <img alt="个人信息" src="/static/images/user.png">个人信息
                    </a>
                    <a>
                        <button open-type="share">
                            <img alt="推荐" src="/static/images/recommend.png">推荐给好友
                        </button>
                    </a>
                    <a href="/pages/about/main">
                        <img alt="关于" src="/static/images/about.png">关于小程序
                    </a>
                    <a @click="logOut">
                        <img alt="退出" src="/static/images/logout.png">退出登录
                    </a>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import config from '@/config'
import { get } from '@/utils/util'
import login from '@/utils/login'
export default {
    data () {
        return {
            userInfo: {
                avatarUrl: config.personUrl + '/avatar.png'
            },
            checkCodeUrl: '',
            cookie: '',
            jwCheckCodeUrl: '',
            jwCookie: '',
            studyNumber: '',
            password: '',
            jwPassword: '',
            jwSerialNumber: '',
            serialNumber: '',
            viewState: '',
            viewStateGenerator: '',
            notice: '',
            canUse: false
        }
    },
    methods: {
        async getPicAndCookie () {
            wx.showLoading({ title: '加载中' })
            if (this.canUse) {
                const data = (await get('/weapp/get_check_code_cookie')).data
                this.checkCodeUrl = 'data:image/png;base64,' + data.image
                this.cookie = data.cookie
            }
            const jwData = (await get('/weapp/jw_check_code_cookie')).data
            this.jwCheckCodeUrl = 'data:image/png;base64,' + jwData.jwImg
            this.jwCookie = jwData.cookie
            this.viewState = jwData.viewState
            this.viewStateGenerator = jwData.viewStateGenerator
            wx.hideLoading()
        },
        async getPic () {
            wx.showLoading({ title: '加载中' })
            const data = await get(`/weapp/get_check_code?cookies=${this.cookie}`)
            this.checkCodeUrl = 'data:image/png;base64,' + data.data.image
            wx.hideLoading()
        },
        async getJwPic () {
            wx.showLoading({ title: '加载中' })
            const data = await get(`/weapp/jw_check_code?cookies=${this.jwCookie}`)
            this.jwCheckCodeUrl = 'data:image/png;base64,' + data.data
            wx.hideLoading()
        },
        async canIuse () {
            try {
                this.canUse = wx.getStorageSync('isOpen')
            } catch (e) {
                const isOpen = await get('/weapp/is_open')
                this.canUse = isOpen.data
            }
        },
        async onLogin () {
            if (this.canUse) {
                if (!this.password || this.password === '') {
                    wx.showToast({
                        title: '请输入密码',
                        icon: 'none',
                        image: '/static/images/warning.png',
                        mask: true
                    })
                    return
                }
                if (!this.serialNumber || this.serialNumber === '') {
                    wx.showToast({
                        title: '请输入验证码',
                        icon: 'none',
                        image: '/static/images/warning.png',
                        mask: true
                    })
                    return
                }
            }
            if (!this.studyNumber || this.studyNumber === '') {
                wx.showToast({
                    title: '请输入学号',
                    icon: 'none',
                    image: '/static/images/warning.png',
                    mask: true
                })
                return
            }
            if (!this.jwPassword || this.jwPassword === '') {
                wx.showToast({
                    title: '请输入教务密码',
                    icon: 'none',
                    image: '/static/images/warning.png',
                    mask: true
                })
                return
            }
            if (!this.jwSerialNumber || this.jwSerialNumber === '') {
                wx.showToast({
                    title: '请输入教务密码',
                    icon: 'none',
                    image: '/static/images/warning.png',
                    mask: true
                })
                return
            }
            wx.showLoading({ title: '登录中' })
            login.setLoginUrl(config.loginUrl)
            login.login({
                success: async (userInfo) => {
                    wx.hideLoading()
                    this.userInfo = userInfo
                    wx.setStorageSync('userInfo', userInfo)
                    wx.showToast({
                        title: '登录成功',
                        icon: 'none',
                        image: '/static/images/success.png',
                        mask: true
                    })
                    const classListData = await get(`/weapp/time_table?open_id=${userInfo.openId}&sno=${userInfo.sno}&sname=${userInfo.sname}`)
                    wx.setStorageSync('classList', classListData.data)
                },
                fail: (err) => {
                    wx.hideLoading()
                    if (this.canUse) this.getPic()
                    this.getJwPic()
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
                cookie: this.cookie,
                jwCookie: this.jwCookie,
                jwPassword: this.jwPassword,
                jwSerialNumber: this.jwSerialNumber,
                viewState: this.viewState,
                viewStateGenerator: this.viewStateGenerator
            })
        },
        getUserInfo () {
            const userInfo = wx.getStorageSync('userInfo')
            if (userInfo.openId) {
                this.userInfo = userInfo
            } else {
                this.userInfo = {
                    avatarUrl: `${config.personUrl}/avatar.png`
                }
            }
        },
        getStudyNumber (e) {
            this.studyNumber = e.mp.detail.value
        },
        getPassword (e) {
            this.password = e.mp.detail.value
        },
        getJwPassword (e) {
            this.jwPassword = e.mp.detail.value
        },
        getSerialNumber (e) {
            this.serialNumber = e.mp.detail.value
        },
        getJwSerialNumber (e) {
            this.jwSerialNumber = e.mp.detail.value
        },
        logOut () {
            try {
                wx.clearStorageSync('userInfo')
            } catch (error) {
            }
            Object.assign(this.$data, this.$options.data())
            this.getPicAndCookie()
        }
    },
    onShow () {
        this.canIuse()
        this.getUserInfo()
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
#person-page {
    position: relative;
}
.avatar-content {
    position: relative;
    display: block;
    width: 220rpx;
    height: 220rpx;
    margin: 40rpx auto 0 auto;
    border-radius: 100rpx;
    z-index: 1;
    background-color: #fff;
}
#avatar {
    width: 200rpx;
    height: 200rpx;
    margin: 10rpx;
    border-radius: 100rpx;
}
.person-content {
    position: relative;
    width: 80%;
    margin: auto;
    margin-top: -120rpx;
    padding-top: 100rpx;
    padding-bottom: 50rpx;
    border-radius: 30rpx;
    z-index: 0;
    background-color: #fff;
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
    border-bottom: 2rpx solid #ccc;
}
#study-number {
    background-image: url('../../../static/images/card.png');
}
#password {
    background-image: url('../../../static/images/password.png');
}
#jw-password {
    background-image: url('../../../static/images/password.png');
}
#serial-number {
    background-image: url('../../../static/images/checkcode.png');
    display: inline-block;
    width: 28%;
}
#jw-serial-number {
    background-image: url('../../../static/images/checkcode.png');
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
    background-image: linear-gradient(45deg, #ffd511 20%, #f8a508);
    background-color: #f8a508;
    color: #333;
    border-radius: 40rpx;
}
button::after {
    border: none;
}
.person-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 75rpx;
}
.person-list a {
    display: block;
    padding: 15rpx 25rpx;
    height: 50rpx;
    border-bottom: 1rpx solid #ccc;
    font-size: 32rpx;
    color: #999;
}
.person-list button {
    display: inline;
    padding: 0;
    border-radius: 0;
    text-align: left;
    font-size: 32rpx;
    line-height: normal;
    color: #999;
    background: transparent;
    box-sizing: unset;
}
.person-list a:last-child {
    border-bottom: none;
}
.person-list a::after {
    content: '';
    float: right;
    display: block;
    background-image: url('../../../static/images/target.png');
    background-repeat: no-repeat;
    margin-top: 10rpx;
    width: 40rpx;
    height: 40rpx;
    background-size: 40rpx 40rpx;
}
.person-list img {
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
    margin-bottom: -6rpx;
}
</style>
