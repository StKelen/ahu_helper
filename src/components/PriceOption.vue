<template>
    <div class="option" :style="OptionStyle" @click="onClick">
        <input v-if="custom" type="text" placeholder="自定义" @input="onInput">
        <p v-else>{{price}}</p>
        <img src="/static/images/selected.png" alt="selected" v-if="checked">
    </div>
</template>

<script>
export default {
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
            backgroundColor: '#FDF9E1', // '#E6E6E6',
            checkedBackgroundColor: '#FFFFFF',
            borderColor: 'transparent',
            checkedBorderColor: '#FFB200',
            finalPrice: 0
        }
    },
    methods: {
        ObjToStyle (obj) {
            let stylesStr = ''
            for (let styleName in obj) {
                if (obj.hasOwnProperty(styleName)) stylesStr += `${styleName.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${obj[styleName]};`
            }
            return stylesStr
        },
        onClick () {
            if (!this.custom) {
                this.finalPrice = this.price
            }
            this.$emit('select', this.index, this.finalPrice)
        },
        onInput (e) {
            this.finalPrice = parseInt(e.mp.detail.value)
            this.$emit('select', this.index, this.finalPrice)
        }
    },
    computed: {
        OptionStyle () {
            return this.ObjToStyle({
                backgroundColor: this.checked ? this.checkedBackgroundColor : this.backgroundColor,
                borderColor: this.checked ? this.checkedBorderColor : this.borderColor
            })
        }
    }
}
</script>

<style scoped>
.option{
    display: flex;
    position: relative;
    flex-direction: column;
    width: 150rpx;
    height: 72rpx;
    margin: 10rpx 10rpx;
    border-width: 3rpx;
    border-radius: 6rpx;
    border-style: solid;
    justify-content: center;
    text-align: center;
    z-index: 0;
}
p{
    font-size: 32rpx;
    font-weight: light;
}
.option img{
    display: block;
    position: absolute;
    right: 0rpx;
    bottom: 0rpx;
    width: 34rpx;
    height: 34rpx;
}
</style>
