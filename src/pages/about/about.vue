// 关于小程序界面
<template>
    <div>
        <!-- 小程序Logo -->
        <div class="logo">
            <img :src="logoUrl" alt="">
        </div>
        <!-- 小程序版本号 -->
        <p id="version">1.0.0</p>
        <!-- 相关协议 -->
        <ul class="list">
            <a href="/pages/openSource/main">开源相关</a>
        </ul>
        <p id="copyright">Powered By 极战の窝</p>
    </div>
</template>

<script>
import config from '@/config'
export default {
    data () {
        return {
            logoUrl: `${config.personUrl}/arcode.png`
        }
    }
}
</script>

<style scoped>
.logo{
    margin-top: 50rpx;
}
.logo img{
    display: block;
    width: 300rpx;
    height: 300rpx;
    margin: auto;
}
#version{
    margin-top: 30rpx;
    color: #999;
    font-size: 32rpx;
    text-align: center;
}
.list{
    margin-top: 100rpx;
    border-top: 1rpx solid #CCC;
    background-color: #FFF;
}
.list a{
    padding: 15rpx 25rpx;
    height: 50rpx;
    border-bottom: 1rpx solid #CCC;
    font-size: 32rpx;
    color: #999;
}
.list a::after{
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
#copyright{
    position: fixed;
    bottom: 20rpx;
    width: 750rpx;
    text-align: center;
    font-size: 28rpx;
    color: #CCC;
}
</style>
