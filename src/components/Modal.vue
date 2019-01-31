<template>
    <div
        class="mask"
        :style="isShow"
        @click="closeModal"
    >
        <div class="modal">
            <div @click.stop class="modal-content">
                <div class="modal-title">{{title}}</div>
                <scroll-view scroll-y="true">
                    <div class="modal-actions">
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
        closeModal () {
            this.$emit('toogleVisible')
        },
        callResultMethod (index) {
            this.$emit('resultMethod', index)
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
    background: rgba(0, 0, 0, 0.7);
    transition: all 0.2s ease-in-out;

    opacity: 0;
    visibility: hidden;
}
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
.modal-content {
    border-radius: 14rpx;
    width: 600rpx;
    margin:auto;
    background-color: #fff;
}
.modal-title {
    height: 9vh;
    margin: 0;
    font-size: 36rpx;
    line-height: 9vh;
    color: #1c2438;
    text-align: center;
    font-weight: bold;
    border-bottom: 5rpx solid #888;
}
scroll-view{
    max-height: 60vh;
}
.modal-actions{
    width: 550rpx;
    margin: auto;
}
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
