<template>
    <a :href="url">
        <div class="decoration">
            <img
                :src="imageUrl"
                alt="装饰图片"
            >
        </div>
        <div id="description">{{name}}</div>
    </a>
</template>

<script>
export default {
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
