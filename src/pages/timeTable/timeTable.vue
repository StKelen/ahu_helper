<template>
    <div>
        <div class="top">
            <div :key="index" class="top-list" v-for="(item,index) in weeksStr">周{{item}}</div>
        </div>
        <div :key="index" class="num" v-for="(item,index) in dayLessons">
            <div class="num-list">{{item}}</div>
            <div
                :style="index === 3||index === 7 ? 'border-bottom-color: #FFD511;' : 'border-bottom-color: lightgray;'"
                class="line"
            ></div>
        </div>
        <div class="table-wrapper">
            <class
                :classInfo="item"
                :index="index"
                :key="index"
                :todayWeek="week"
                @changeInfo="showDetail"
                v-for="(item,index) in classList"
            ></class>
        </div>
        <class-detail
            :lesson="selectLesson"
            :visible="isShowDetail"
            @toogleVisible="toogleDetailVisible"
        ></class-detail>
    </div>
</template>

<script>
// import config from '@/config'
import Class from '@/components/Class.vue'
import classDetail from '@/components/classDetail.vue'
import { get } from '@/utils/util'
export default {
    components: {
        Class,
        classDetail
    },
    data () {
        return {
            classList: [],
            week: 1,
            weeksStr: ['一', '二', '三', '四', '五', '六', '日'],
            dayLessons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            selectLesson: {},
            isShowDetail: false
        }
    },
    async onShow () {
        wx.showLoading({ title: '加载中' })
        await this.getTodayWeek()
        wx.hideLoading()
        await this.getClassList()
    },
    methods: {
        async getClassList () {
            wx.showLoading({ title: '加载中' })
            try {
                this.classList = wx.getStorageSync('classList')
                wx.hideLoading()
                if (this.classList.length === 0) throw new Error('没有获取到课程信息')
            } catch (e) {
                wx.hideLoading()
                wx.showToast({
                    title: '请登录',
                    icon: 'none',
                    image: '/static/images/info.png',
                    mask: true
                })
            }
        },
        async getTodayWeek () {
            this.week = (await get('/weapp/get_week')).data
        },
        showDetail (lesson) {
            this.isShowDetail = true
            this.selectLesson = lesson
        },
        toogleDetailVisible () {
            this.isShowDetail = false
        }
    },
    computed: {
    }
}
</script>

<style scoped>
.top {
    display: flex;
    flex-direction: row;
    margin-left: 9vw;
    background-color: #ffd511;
    color: #000000;
}
.top-list {
    width: 13vw;
    height: 3vh;
    font-size: 20rpx;
    justify-content: center;
    display: flex;
    align-items: center;
}
.num-list {
    width: 9vw;
    height: 10vh;
    font-size: 20rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #ffd511;
    color: #000000;
}
.line {
    width: 750rpx;
    position: absolute;
    /* margin-top: 3vh; */
    margin-left: 67.5rpx;
    border-bottom: 1rpx solid;
}
.table-wrapper {
    display: absolute;
    top: 3vh;
    left: 9vw;
}
</style>
