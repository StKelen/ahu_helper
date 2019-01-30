<template>
    <div
        class="mask"
        :style="isShow"
        @click="closeModal"
    >
        <div class="modal">
            <div @click.stop class="modal-content">
                <div class="modal-title">{{title}}</div>
                <div class="modal-actions">
                    <button
                        v-for="(item,index) in list"
                        :key="index"
                        class="modal-action"
                        @click="callResultMethod(index)"
                    >{{item[showKey]}}</button>
                </div>
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
    overflow: auto;
    width: 750rpx;
    height: 100%;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateZ(1rpx);

    /* opacity: 0;
    visibility: hidden; */
}
.modal-content {
    border-radius: 7px;
    padding-top: 15px;
    width: 600rpx;
    background-color: #fff;
    overflow: hidden;
}
.modal-title {
    padding: 12rpx 30rpx 30rpx 30rpx;
    margin: 0;
    font-size: 36rpx;
    color: #1c2438;
    text-align: center;
}
.modal-action {
    text-align: center;
    vertical-align: middle;
    margin: 0;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 0;
    color: #495060;
    background-color: #fff;
}
.modal-action::after {
    border: 0;
    border-radius: 0;
    border-top: 0.2rpx solid #aaa;
}
</style>
