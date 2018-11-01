<template>
    <ul>
        <div id="decoration">
            <img :src="imageUrl" alt="装饰图片">
        </div>
        <div id="description">{{name}}</div>
    </ul>
</template>

<script>
export default {
    props: ['name', 'imageUrl']
}
</script>

<style scoped>
ul {
  display: inline-block;
  position: relative;
  width: 330rpx;
  height: 350rpx;
  margin: 30rpx 20rpx;
  border-radius: 15rpx;
  border: 2rpx #CCC solid;
  background-color: #FFFFFF;
  box-shadow: 0 10rpx 15rpx 0 rgba(0, 0, 0, 0.15),
    0 0 30rpx 0 rgba(225, 225, 225, 0.1);
}
div#decoration {
  height: 250rpx;
  border-radius: 15rpx 15rpx 0 0;
  border-bottom: 1rpx #CCC solid;
  /* background-image: linear-gradient(45deg, #4481eb 0%, #04aeee 100%); */
}
div#decoration img {
  position: relative;
  display: block;
  width: 250rpx;
  height: 150rpx;
  left: 40rpx;
  top: 50rpx;
}
div#description {
  height: 100rpx;
  font-size: 40rpx;
  font-weight: 400;
  color: #555;
  text-align: center;
  padding-top: 20rpx; 
}
</style>
