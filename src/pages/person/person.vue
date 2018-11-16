<template>
    <div>
        <img id="avatar" :src="userInfo.avatarUrl" alt="头像">
        <div class="input-area">
            <input type="text" id="study-number" placeholder="学号">
        </div>
        <div class="input-area">
            <input type="text" password=true id="password" placeholder="校园卡查询密码">
        </div>
        <div class="input-area">
            <input type="text" id="serial-number" placeholder="验证码">
            <img src="/static/code.png" alt="验证码">
        </div>
        <div id="test"></div>
    </div>
</template>

<script>
import config from '@/config'
import qcloud from 'wafer2-client-sdk'
export default {
    data () {
        return {
            userInfo: {
                avatarUrl: `${config.personUrl}avatar.png`
            }
        }
    },
    methods: {
        login () {
            qcloud.setLoginUrl(config.loginUrl)
            qcloud.login({
                success: (userInfo) => {
                    console.log('登录成功', userInfo)
                },
                fail: (err) => {
                    console.log('登录失败', err)
                }
            })
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
    background-image:  url('../../../static/images/password.png');
    display: inline-block;
    width: 28%;
}
.input-area img {
    float: right;
    width: 210rpx;
    height: 80rpx;
}
/* input::before {
    display: inline-block;
    width: 60rpx;
    height: 60rpx;
    margin: 10rpx 0 10rpx -70rpx;
    content: '';
}
#study-number::before {
    background-size: 100% 100%;
}
#password::before {
    background: url('../../../static/images/password.png') no-repeat left center;
    background-size: 100% 100%;
} */
</style>
