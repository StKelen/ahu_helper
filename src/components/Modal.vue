// 该模块为支付相关页面的选择列表模块
<template>
    <!-- 最外部为遮罩层，包括样式绑定——是否显示，点击旁边的遮罩触发的事件 -->
    <div
        class="mask"
        :style="isShow"
        @click="closeModal"
    >
        <!-- 中心的选择列表部分 -->
        <div class="modal">
            <!-- 防止触发关闭遮罩层的事件 -->
            <div @click.stop class="modal-content">
                <!-- 选择列表的标题 -->
                <div class="modal-title">{{title}}</div>
                <!-- 选择列表区，允许滚动 -->
                <scroll-view scroll-y="true">
                    <div class="modal-actions">
                        <!-- 循环选择列表，绑定点击事件 -->
                        <button
                            v-for="(item,index) in list"
                            :key="index"
                            class="modal-action"
                            @click="callResultMethod(index)"
                        >{{item[showKey]}}</button>
                    </div>
                </scroll-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // 从父组件中传入的参数，依次为选择的标题、选择列表、是否显示、列表显示的文字应该是对象中的属性名
    props: {
        title: {
            type: String,
            default: '请选择'
        },
        list: {
            type: Object,
            default: []
        },
        visible: {
            type: Boolean,
            default: false
        },
        showKey: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    },
    methods: {
        // 关闭遮罩层
        closeModal () {
            this.$emit('toogleVisible')
        },
        // 将选择的结果触发事件给父组件
        callResultMethod (index) {
            this.$emit('resultMethod', index)
        }
    },
    computed: {
        // 控制是否显示的相关样式
        isShow () {
            return this.visible ? 'opacity: 1; visibility: visible;' : ''
        }
    }
}
</script>

<style scoped>
/* 遮罩层相关样式 */
.mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.7);
    transition: all 0.2s ease-in-out;
    /* 默认不显示 */
    opacity: 0;
    visibility: hidden;
}
/* 负责中间选择列表的相关定位 */
.modal {
    position: absolute;
    width: 750rpx;
    height: 70vh;
    margin-top:15vh;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateZ(1rpx);
}
/* 内包裹，负责定位 */
.modal-content {
    position: relative;
    border-radius: 14rpx;
    width: 600rpx;
    margin:auto;
    background-color: #fff;
}
/* 列表标题 */
.modal-title {
    position: relative;
    z-index: 1;
    height: 9vh;
    margin: 0;
    font-size: 36rpx;
    line-height: 9vh;
    color: #1c2438;
    text-align: center;
    font-weight: bold;
    box-shadow: 0 10rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
}
/* 设置列表滚动区的高度 */
scroll-view{
    position: relative;
    z-index: 0;
    max-height: 60vh;
}
/* 设置列表的宽度 */
.modal-actions{
    width: 550rpx;
    margin: auto;
}
/* 负责设置列表项的样式，删除默认的样式 */
.modal-action {
    text-align: center;
    vertical-align: middle;
    margin: 0;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 0;
    color: #495060;
    background-color: #FFF;
    border-bottom: 0.2rpx solid #DDD;
}
.modal-action::after {
    border: 0;
    border-radius: 0;
}
</style>
