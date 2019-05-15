<template>
    <div :style="isShow" @click="toogleVisible" class="mask">
        <div class="out-container">
            <div class="container">
                <div class="title">课程信息</div>
                <div class="name">
                    <span class="info">名称：</span>
                    <p>{{lesson.name}}</p>
                </div>
                <div class="teacher">
                    <span class="info">教师：</span>
                    <p>{{lesson.teacher}}</p>
                </div>
                <div class="pos">
                    <span class="info">教室：</span>
                    <p>{{lesson.position}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        lesson: {
            type: Object,
            default: {}
        },
        visible: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {}
    },
    methods: {
        toogleVisible () {
            this.$emit('toogleVisible')
        }
    },
    computed: {
        isShow () {
            return this.visible ? 'opacity: 1; visibility: visible;' : ''
        }
    }
}
</script>

<style scoped>
.mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease-in-out;

    opacity: 0;
    visibility: hidden;
}
.out-container {
    position: absolute;
    margin-top: 30vh;
    height: 30vh;
    width: 100vw;
}
.container {
    margin: auto;
    width: 600rpx;
    border-radius: 25rpx;
    background-color: #ffffff;
    padding-bottom: 20rpx;
    box-shadow: 0 0 40rpx 30rpx rgba(0, 0, 0, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
}
.title {
    font-size: 48rpx;
    font-weight: blod;
    text-align: center;
    line-height: 100rpx;
    border-bottom: 1rpx solid #333;
    color: #444;
}
.name,
.teacher,
.pos {
    margin: 15rpx 25rpx;
}
.name p,
.teacher p,
.pos p {
    display: inline-flex;
    width: 420rpx;
    font-size: 32rpx;
    color: #999;
}
.info {
    width: 120rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #6a6a6a;
}
</style>
