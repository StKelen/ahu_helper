<template>
    <div>
        <img id="avatar" :src="userInfo.avatarUrl" alt="头像">
        <label>
            <input type="text" id="study-number">
        </label>
        <label for="password">
            <input type="password">
        </label>
        <label for="serial-number">
            <input type="text">
        </label>
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
label {
    display: block;
    width: 80%;
    height: 80rpx;
    margin: 50rpx auto;
    background-color: #fff;
    box-shadow: 0rpx 0rpx 15rpx rgba(204, 180, 0, 0.6) inset;
    border-radius: 40rpx;
}
input{
    display: inline-block;
    height: 80rpx;
    width: 70%;
    font-size: 30rpx;
    font-weight: light;
    color: #888;
}
label:before {
    display: inline-block;
    width: 60rpx;
    height: 60rpx;
    margin: auto 20rpx 10rpx 40rpx;
    background: url('../../../static/images/card.png') no-repeat left center;
    background-size: 100% 100%;
    content: '';
}
</style>
