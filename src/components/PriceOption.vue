// 该组件为支付有关页面单个价格选择组件
<template>
    <!-- 绑定样式以及点击事件 -->
    <div :style="OptionStyle" @click="onClick" class="option">
        <!-- 判断是否为自定义价格，如果是，显示输入框 -->
        <input @input="onInput" placeholder="自定义" type="text" v-if="custom">
        <!-- 预置价格 -->
        <p v-else>{{price}}</p>
    </div>
</template>

<script>
export default {
    // 父组件传入的参数，依次为价格、是否被选中、当前支付组件的顺序——设置样式
    props: {
        price: {
            type: Number
        },
        checked: {
            type: Boolean,
            default: false
        },
        custom: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            default: -1
        }
    },
    data () {
        return {
            // 最终返回给父组件的价格
            finalPrice: 0
        }
    },
    methods: {
        // 将样式的对象转换为字符串形式
        ObjToStyle (obj) {
            let stylesStr = ''
            for (let styleName in obj) {
                if (obj.hasOwnProperty(styleName)) stylesStr += `${styleName.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${obj[styleName]};`
            }
            return stylesStr
        },
        // 设置点击事件
        onClick () {
            // 如果不是自定义价格，直接设置为父组件传入的价格
            if (!this.custom) {
                this.finalPrice = this.price
            }
            // 触发父组件的选择事件，传出选择的序号和价格
            this.$emit('select', this.index, this.finalPrice)
        },
        // 设置自定义价格的输入
        onInput (e) {
            if (this.price <= 0) this.finalPrice = '0'
            // 设置最终价格并触发父组件事件
            this.finalPrice = parseInt(e.mp.detail.value)
            this.$emit('select', this.index, this.finalPrice)
        }
    },
    computed: {
        // 设置是否选中的样式
        OptionStyle () {
            return this.ObjToStyle({
                backgroundColor: this.checked ? '' : '#FDF9E1',
                backgroundImage: this.checked ? 'linear-gradient(135deg, #FFD511 20%, #F8A508)' : '',
                color: this.checked ? '#000' : '#666'
            })
        }
    }
}
</script>

<style scoped>
.option {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 150rpx;
    height: 72rpx;
    margin: 10rpx 10rpx;
    border-radius: 6rpx;
    border-style: solid;
    justify-content: center;
    text-align: center;
    z-index: 0;
    border-width: 0;
}
.option {
    font-size: 32rpx;
    font-weight: light;
}
p {
    font-size: 32rpx;
    font-weight: light;
}
</style>
