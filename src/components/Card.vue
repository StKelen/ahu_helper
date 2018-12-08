<template>
    <ul>
        <a :href="url">
            <div id="decoration">
                <img :src="imageUrl" alt="装饰图片">
            </div>
            <div id="description">{{name}}</div>
        </a>
    </ul>
</template>

<script>
export default {
    props: ['name', 'imageUrl', 'url']
}
</script>

<style scoped>
ul {
  display: inline-block;
  position: relative;
  width: 300rpx;
  height: 250rpx;
  margin: 50rpx 0rpx 0rpx 50rpx;
  border-radius: 15rpx;
  /* border: 1rpx #CACACA solid; */
  background-color: #FFFFFF;
  box-shadow: 0 10rpx 15rpx 0 rgba(0, 0, 0, 0.15),
    0 0 30rpx 0 rgba(225, 225, 225, 0.1);
}
div#decoration {
  height: 180rpx;
  border-radius: 15rpx 15rpx 0 0;
  border-bottom: 0.5rpx #D5D5D5 solid;
  /* background-image: linear-gradient(45deg, #4481eb 0%, #04aeee 100%); */
}
div#decoration img {
  position: relative;
  display: block;
  width: 200rpx;
  height: 120rpx;
  left: 50rpx;
  top: 30rpx;
  opacity: 0.8;
}
div#description {
  height: 70rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: #555;
  text-align: center;
  padding-top: 18rpx; 
}
</style>
