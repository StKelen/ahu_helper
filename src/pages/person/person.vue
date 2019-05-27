// 个人中心页面
<template>
    <div class="person-page">
        <!-- 顶部头像 -->
        <div class="avatar-content">
            <img :src="userInfo.avatarUrl" alt="头像" id="avatar">
        </div>
        <!-- 下方个人界面 -->
        <div class="person-content">
            <!-- 判断是否登录，如果没有，显示登陆信息 -->
            <div class="input-field" v-if="!userInfo.openId">
                <!-- 学号 -->
                <div class="input-area">
                    <input @input="getStudyNumber" id="study-number" placeholder="学号" type="text">
                </div>
                <!-- 校园卡查询密码 -->
                <div class="input-area" v-if="canUse">
                    <input
                        @input="getPassword"
                        id="password"
                        password="true"
                        placeholder="校园卡查询密码"
                        type="text"
                    >
                </div>
                <!-- 教务系统密码 -->
                <div class="input-area">
                    <input
                        @input="getJwPassword"
                        id="jw-password"
                        password="true"
                        placeholder="教务系统密码"
                        type="text"
                    >
                </div>
                <!-- 支付系统验证码 -->
                <div class="input-area" v-if="canUse">
                    <input
                        @input="getSerialNumber"
                        id="serial-number"
                        placeholder="验证码"
                        type="text"
                    >
                    <img :src="checkCodeUrl" @click="getPic" alt="验证码">
                </div>
                <!-- 教务系统验证码 -->
                <div class="input-area">
                    <input
                        @input="getJwSerialNumber"
                        id="jw-serial-number"
                        placeholder="验证码"
                        type="text"
                    >
                    <img :src="jwCheckCodeUrl" @click="getJwPic" alt="验证码">
                </div>
                <!-- 登录按钮 -->
                <button @getuserinfo="onLogin" lang="zh_CN" open-type="getUserInfo">登 录</button>
            </div>
            <!-- 如果登录，显示个人中心相关列表 -->
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
            // 默认的用户信息只有默认的用户头像
            userInfo: {
                avatarUrl: config.personUrl + '/avatar.png'
            },
            // 支付系统验证码地址和cookies
            checkCodeUrl: '',
            cookie: '',
            // 教务系统验证码地址和cookies
            jwCheckCodeUrl: '',
            jwCookie: '',
            // 学号
            studyNumber: '',
            // 支付系统密码
            password: '',
            // 教务系统密码
            jwPassword: '',
            // 教务系统验证码
            jwSerialNumber: '',
            // 支付系统验证码
            serialNumber: '',
            // 教务系统相关参数
            viewState: '',
            viewStateGenerator: '',
            // 用于设置登录相关提示
            notice: '',
            // 设置是否可以登录支付系统
            canUse: false
        }
    },
    methods: {
        // 获取验证码图片和cookies。图片已经进行base64编码
        async getPicAndCookie () {
            if (this.canUse) {
                const payData = await get('/weapp/get_check_code_cookie')
                const data = payData.data
                this.checkCodeUrl = 'data:image/png;base64,' + data.image
                this.cookie = data.cookie
            }
            const jwData = await get('/weapp/jw_check_code_cookie')
            const jwInfo = jwData.data
            this.jwCheckCodeUrl = 'data:image/png;base64,' + jwInfo.jwImg
            this.jwCookie = jwInfo.cookie
            // 设置教务系统相关参数
            this.viewState = jwInfo.viewState
            this.viewStateGenerator = jwInfo.viewStateGenerator
        },
        // 刷新支付系统验证码
        async getPic () {
            wx.showLoading({ title: '加载中' })
            const data = await get(`/weapp/get_check_code?cookies=${this.cookie}`)
            this.checkCodeUrl = 'data:image/png;base64,' + data.data.image
            wx.hideLoading()
        },
        // 刷新教务系统验证码
        async getJwPic () {
            wx.showLoading({ title: '加载中' })
            const data = await get(`/weapp/jw_check_code?cookies=${this.jwCookie}`)
            this.jwCheckCodeUrl = 'data:image/png;base64,' + data.data
            wx.hideLoading()
        },
        // 判断是否启用支付功能
        async canIuse () {
            try {
                this.canUse = await wx.getStorageSync('isOpen')
            } catch (e) {
                const isOpen = await get('/weapp/is_open')
                this.canUse = isOpen.data
            }
        },
        // 登录请求
        async onLogin () {
            // 判断是否已经输入相关账号密码
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
            // 设置登录地址
            login.setLoginUrl(config.loginUrl)
            // 发起登录请求，由Wafer进行封装
            login.login({
                success: async (userInfo) => {
                    // 登录成功
                    wx.hideLoading()
                    // 获取用户微信信息并保存在本地
                    this.userInfo = userInfo
                    wx.setStorageSync('userInfo', userInfo)
                    wx.showToast({
                        title: '登录成功',
                        icon: 'none',
                        image: '/static/images/success.png',
                        mask: true
                    })
                    // 获取用户课表信息并保存在本地
                    const classListData = await get(`/weapp/time_table?open_id=${userInfo.openId}&sno=${userInfo.sno}&sname=${userInfo.sname}`)
                    wx.setStorageSync('classList', classListData.data)
                },
                fail: (err) => {
                    // 登录失败
                    wx.hideLoading()
                    // 重新获取验证码图片
                    if (this.canUse) this.getPic()
                    this.getJwPic()
                    wx.showToast({
                        title: err,
                        icon: 'none',
                        image: '/static/images/warning.png',
                        mask: true
                    })
                },
                // 向登录请求传入相关参数
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
        // 获取微信个人信息
        async getUserInfo () {
            let userInfo
            try {
                userInfo = wx.getStorageSync('userInfo')
            } catch (e) {
                this.userInfo = {
                    avatarUrl: `${config.personUrl}/avatar.png`
                }
            }
            if (userInfo.openId) {
                this.userInfo = userInfo
            } else {
                this.userInfo = {
                    avatarUrl: `${config.personUrl}/avatar.png`
                }
            }
        },
        // 获取页面输入框相关数据封装
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
        // 退出登录。清除微信个人信息并重载页面
        logOut () {
            try {
                wx.clearStorageSync('userInfo')
            } catch (error) {
            }
            Object.assign(this.$data, this.$options.data())
            this.getPicAndCookie()
        }
    },
    async onShow () {
        wx.showLoading({ title: '加载中' })
        // 判断是否可以登录支付系统并获取验证码图片
        await this.canIuse()
        await this.getUserInfo()
        if (!this.userInfo.openId) {
            await this.getPicAndCookie()
        }
        wx.hideLoading()
        // 判断是否从其它页面传入登录请求
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
/* 总定位 */
#person-page {
    position: relative;
}
/* 顶部头像 */
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
/* 个人信息界面,设置定位和边框 */
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
/* 输入区域设置 */
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
/* 各输入框前图标样式 */
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
/* 登录按钮样式 */
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
/* 登录后相关按钮布局 */
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
/* 设置列表间的分割线样式 */
.person-list a:last-child {
    border-bottom: none;
}
/* 设置右边指向箭头 */
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
