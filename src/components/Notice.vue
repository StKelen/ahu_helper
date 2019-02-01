<template>
    <div>
        <div class="notice-main" :style="isShow">
            <div class="notice-img">
                <img :src="setNoticeImg" alt="提示图片" class="notice-img">
            </div>
            <div class="notice-content">{{content}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'info'
        },
        content: {
            type: String,
            default: ''
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        setNoticeImg () {
            return `/static/images/${this.type}.png`
        },
        isShow () {
            return this.visible ? 'opacity: 1; visibility: visible;' : ''
        }
    },
    data () {
        return {
        }
    },
    methods: {
    }
}
</script>

<style scoped>
.notice-main{
    position: fixed;
    display: flex;
    flex-flow: row;
    width: 500rpx;
    height: 90rpx;
    top: 30rpx;
    right: 30rpx;
    padding: 30rpx;
    background-color: #FFF;
    box-shadow: 0 0 20rpx 15rpx rgba(225, 225, 225, 0.2),
        10rpx 15rpx 30rpx 0rpx rgba(0, 0, 0, 0.3);
    border-radius: 40rpx;
    opacity: 0; 
    visibility: hidden;
}
.notice-img{
    width: 70rpx;
    height: 70rpx;
    margin-top: 6rpx;
}
.notice-content{
    width: 350rpx;
    margin-left: 20rpx;
    padding-left: 30rpx;
    font-size: 30rpx;
    border-left: 3.5rpx solid #CCC;
    color: #888;
}
</style>

