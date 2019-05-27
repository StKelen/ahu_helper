// 浴室开放查询界面
<template>
    <div>
        <!-- 今天开放的浴室信息 -->
        <div id="today">
            <div class="man">
                <img :src="maleUrl" alt="男生图片">
                <ul class="list">
                    <!-- 循环男生开放的浴室列表 -->
                    <li :key="index" v-for="(item,index) in arrange.today.man">{{item}}</li>
                </ul>
            </div>
            <div class="woman">
                <img :src="femaleUrl" alt="女生图片">
                <ul class="list">
                    <!-- 循环女生开放的浴室列表 -->
                    <li :key="index" v-for="(item,index) in arrange.today.woman">{{item}}</li>
                </ul>
            </div>
            <!-- 中间的日期信息 -->
            <div class="date">
                <p class="date-desc">今天</p>
                <p class="date-detail">{{toMonth}}月{{toDay}}日</p>
            </div>
        </div>
        <!-- 明天开放的浴室信息 -->
        <div id="tomorrow">
            <div class="man">
                <img :src="maleUrl" alt="男生图片">
                <ul class="list">
                    <!-- 循环男生开放的浴室列表 -->
                    <li :key="index" v-for="(item,index) in arrange.tomorrow.man">{{item}}</li>
                </ul>
            </div>
            <div class="woman">
                <img :src="femaleUrl" alt="女生图片">
                <ul class="list">
                    <!-- 循环女生开放的浴室列表 -->
                    <li :key="index" v-for="(item,index) in arrange.tomorrow.woman">{{item}}</li>
                </ul>
            </div>
            <!-- 中间的日期信息 -->
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
            // 浴室开放安排的数据
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
            // 今天的日期
            toDay: 0,
            // 今天的月份
            toMonth: 0,
            // 明天的日期
            morrowDay: 0,
            // 明天的月份
            morrowMonth: 0,
            // 男、女生图片地址
            maleUrl: '',
            femaleUrl: ''
        }
    },
    async onLoad () {
        // 初始化数据
        Object.assign(this.$data, this.$options.data())
        wx.showLoading({ title: '加载中' })
        // 设置男、女生图片地址
        this.maleUrl = `${config.bathUrl}/man.png`
        this.femaleUrl = `${config.bathUrl}/woman.png`
        const toDate = new Date()
        // 获得今天的日期
        this.toDay = toDate.getDate()
        this.toMonth = toDate.getMonth() + 1
        // 获得明天日期的Date对象，为今天的毫秒数加上一天的毫秒数数
        const morrowDate = new Date(toDate.getTime() + 24 * 60 * 60 * 1000)
        // 获取明天的日期
        this.morrowDay = morrowDate.getDate()
        this.morrowMonth = morrowDate.getMonth() + 1
        // 获取浴室开放信息
        await this.getBathInfo()
        wx.hideLoading()
    },
    methods: {
        // 获取浴室开放信息
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
/* 设置定位 */
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
/* 设置日期定位 */
.date {
    position: absolute;
    width: 200rpx;
    height: 200rpx;
    z-index: 3;
    border-radius: 100rpx;
}
/* 先关日期的文字设置 */
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
/* 男女生图片的定位 */
img {
    display: block;
    position: absolute;
    height: 200rpx;
    width: 100rpx;
    top: 25rpx;
    left: 30rpx;
}
/* 浴室开放列表的定位 */
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
/* 相关颜色、定位的设置 */
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
