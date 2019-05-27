// 该组件为课程详细信息的模块，包含遮罩层
<template>
    <!-- 绑定样式——是否显示，点击时关闭遮罩层 -->
    <div :style="isShow" @click="toogleVisible" class="mask">
        <!-- 详细信息卡片部分 -->
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
    // 父组件传入的参数，依次为课程信息、是否显示
    props: {
        lesson: {
            type: Object,
            default: {}
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {}
    },
    methods: {
        // 是否显示的交替开关
        toogleVisible () {
            // 触发父组件事件，将父组件的是否显示进行修改，从而影响本组件props
            this.$emit('toogleVisible')
        }
    },
    computed: {
        isShow () {
            // 判断是否显示
            return this.visible ? 'opacity: 1; visibility: visible;' : ''
        }
    }
}
</script>

<style scoped>
/* 最外层的遮罩 */
.mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease-in-out;

    /* 默认不显示 */
    opacity: 0;
    visibility: hidden;
}
/* 外层包裹，用于定位 */
.out-container {
    position: absolute;
    margin-top: 30vh;
    height: 30vh;
    width: 100vw;
}
/* 内层包裹，控制相关样式 */
.container {
    margin: auto;
    width: 600rpx;
    border-radius: 25rpx;
    background-color: #ffffff;
    padding-bottom: 20rpx;
    box-shadow: 0 0 40rpx 30rpx rgba(0, 0, 0, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
}
/* 相关文字内容的样式 */
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
