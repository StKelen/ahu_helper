<template>
    <div>
        <div id="today">
            <div class="man">
                <img :src="maleUrl" alt="男生图片">
                <ul class="list">
                    <li :key="index" v-for="(item,index) in arrange.today.man">{{item}}</li>
                </ul>
            </div>
            <div class="woman">
                <img :src="femaleUrl" alt="女生图片">
                <ul class="list">
                    <li :key="index" v-for="(item,index) in arrange.today.woman">{{item}}</li>
                </ul>
            </div>
            <div class="date">
                <p class="date-desc">今天</p>
                <p class="date-detail">{{toMonth}}月{{toDay}}日</p>
            </div>
        </div>
        <div id="tomorrow">
            <div class="man">
                <img :src="maleUrl" alt="男生图片">
                <ul class="list">
                    <li :key="index" v-for="(item,index) in arrange.tomorrow.man">{{item}}</li>
                </ul>
            </div>
            <div class="woman">
                <img :src="femaleUrl" alt="女生图片">
                <ul class="list">
                    <li :key="index" v-for="(item,index) in arrange.tomorrow.woman">{{item}}</li>
                </ul>
            </div>
            <div class="date">
                <p class="date-desc">明天</p>
                <p class="date-detail">{{morrowMonth}}月{{morrowDay}}日</p>
            </div>
        </div>
    </div>
</template>
<script>
import config from '@/config'
import { get } from '@/utils/util'
export default {
    data () {
        return {
            arrange: {
                today: {
                    man: [],
                    woman: []
                },
                tomorrow: {
                    man: [],
                    woman: []
                }
            },
            toDay: 0,
            toMonth: 0,
            morrowDay: 0,
            morrowMonth: 0,
            maleUrl: '',
            femaleUrl: ''
        }
    },
    async onLoad () {
        Object.assign(this.$data, this.$options.data())
        wx.showLoading({ title: '加载中' })
        this.maleUrl = `${config.bathUrl}/man.png`
        this.femaleUrl = `${config.bathUrl}/woman.png`
        const toDate = new Date()
        this.toDay = toDate.getDate()
        this.toMonth = toDate.getMonth() + 1
        const morrowDate = new Date(toDate.getTime() + 24 * 60 * 60 * 1000)
        this.morrowDay = morrowDate.getDate()
        this.morrowMonth = morrowDate.getMonth() + 1
        await this.getBathInfo()
        wx.hideLoading()
    },
    methods: {
        async getBathInfo () {
            const arragements = await get('/weapp/bath_info')
            this.arrange = arragements.data
        }
    }
}
</script>
<style scoped>
#today {
    position: relative;
}
.man {
    position: fixed;
    width: 600rpx;
    height: 250rpx;
    z-index: 2;
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
}
.woman {
    position: fixed;
    width: 600rpx;
    height: 247rpx;
    z-index: 1;
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
}
.date {
    position: absolute;
    width: 200rpx;
    height: 200rpx;
    z-index: 3;
    border-radius: 100rpx;
}
.date .date-desc {
    font-size: 48rpx;
    margin-top: 35rpx;
    text-align: center;
    color: #ffffff;
}
.date .date-detail {
    margin-top: 15rpx;
    font-size: 36rpx;
    text-align: center;
    color: #ffffff;
}
img {
    display: block;
    position: absolute;
    height: 200rpx;
    width: 100rpx;
    top: 25rpx;
    left: 30rpx;
}
.list {
    position: absolute;
    right: 30rpx;
    line-height: 60rpx;
    color: #ffffff;
    font-weight: bold;
}
.man .list {
    top: 55rpx;
}
.woman .list {
    top: 85rpx;
}
#today .man {
    top: 50rpx;
    left: 75rpx;
    background-image: linear-gradient(0deg, #4089ff 20%, #26b0fe);
    box-shadow: 10rpx 0 15rpx #a6c8ff, -10rpx 0 15rpx #a6c8ff,
        0 -10rpx 15rpx #a6c8ff, 0 6rpx #fc2f0b;
}
#today .woman {
    top: 303rpx;
    left: 75rpx;
    background-image: linear-gradient(0deg, #ff6a24, #fc2f0b 80%);
    box-shadow: 10rpx 0 15rpx #ffab9c, -10rpx 0 15rpx #ffab9c,
        0 10rpx 15rpx #ffab9c;
}
#today .date {
    top: 200rpx;
    left: 270rpx;
    background-image: linear-gradient(135deg, #ffd446 20%, #ffb543);
    box-shadow: 0 0 20rpx 5rpx rgba(225, 225, 225, 0.5);
}
#tomorrow .man {
    top: 600rpx;
    left: 75rpx;
    background-color: #a6c8ff;
}

#tomorrow .woman {
    top: 850rpx;
    left: 75rpx;
    height: 250rpx;
    background-color: #ffab9c;
}
#tomorrow .date {
    top: 750rpx;
    left: 270rpx;
    background-color: #ffe283;
}
</style>
