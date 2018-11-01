<template>
    <li>
        <img :src="imageUrl" alt="装饰图片">
        <h1>{{name}}</h1>
    </li>
</template>

<script>
export default {
    props: ['name', 'imageUrl']
}
</script>

<style scoped>
li{
    position: relative;
    width: 700rpx;
    height:300rpx;
    margin: 30rpx 25rpx;
    border-radius: 30rpx;
    box-shadow: 0 10rpx 30rpx 0 rgba(0,0,0,0.20), 0 0 50rpx 0 rgba(0,0,0,0.15);
    background-image:  linear-gradient(45deg, #4481EB 0%, #04AEEE 100%);
}
li img{
    position: absolute;
    left: 10rpx;
    bottom: 35rpx;
    height: 180rpx;
    width: 300rpx;
}
li h1{
    position: absolute;
    top: 20rpx;
    right: 50rpx;
    font-size: 50rpx;
    font-weight: 400;
    color: #EEE;
}
</style>
