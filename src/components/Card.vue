// 该组件为首页单个卡片模块
<template>
    <a :href="url">
        <div class="decoration">
            <!-- 每张卡片的图标 -->
            <img
                :src="imageUrl"
                alt="装饰图片"
            >
        </div>
        <!-- 每张卡片的文字内容 -->
        <div id="description">{{name}}</div>
    </a>
</template>

<script>
export default {
    // 父组件传入的参数，依次为卡片显示文字、装饰图标地址、所跳转页面的地址
    props: ['name', 'imageUrl', 'url']
}
</script>

<style scoped>
a {
    display: inline-block;
    width: 300rpx;
    height: 250rpx;
    margin: 50rpx 0rpx 0rpx 50rpx;
    border-radius: 30rpx;
    background-color: #ffffff;
    box-shadow: 0 0 40rpx 30rpx rgba(225, 225, 225, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
}
/* 图标的定位 */
div.decoration {
    height: 150rpx;
    border-radius: 15rpx 15rpx 0 0;
}
div.decoration img {
    position: fixed;
    display: block;
    width: 150rpx;
    height: 90rpx;
    margin: 40rpx 75rpx 0 75rpx;
    opacity: 0.8;
}
/* 底部文字介绍的相关样式 */
div#description {
    height: 80rpx;
    width: 220rpx;
    margin: 5rpx auto;
    font-size: 32rpx;
    line-height: 80rpx;
    font-weight: 400;
    text-align: center;
    color: #555;
    background-color: rgba(250, 220, 200, 0.2);
    border-radius: 15rpx;
}
</style>
