// 课程表页面
<template>
    <div>
        <!-- 顶部周几显示循环 -->
        <div class="top">
            <div :key="index" class="top-list" v-for="(item,index) in weeksStr">周{{item}}</div>
        </div>
        <!-- 左侧课程节数显示循环 -->
        <div :key="index" class="num" v-for="(item,index) in dayLessons">
            <div class="num-list">{{item}}</div>
            <!-- 判断是否为下午或晚上分隔,使用不同的颜色 -->
            <div
                :style="index === 3||index === 7 ? 'border-bottom-color: #FFD511;' : 'border-bottom-color: lightgray;'"
                class="line"
            ></div>
        </div>
        <!-- 课程表外层包裹 -->
        <div class="table-wrapper">
            <!-- 循环所有课程数组并渲染在课程表上.依次绑定课程信息、课程序号、当前周数、触发遮罩层事件 -->
            <class
                :classInfo="item"
                :index="index"
                :key="index"
                :todayWeek="week"
                @changeInfo="showDetail"
                v-for="(item,index) in classList"
            ></class>
        </div>
        <!-- 详细课程信息遮罩层，依次绑定课程信息，是否显示，开关显示事件 -->
        <class-detail
            :lesson="selectLesson"
            :visible="isShowDetail"
            @toogleVisible="toogleDetailVisible"
        ></class-detail>
    </div>
</template>

<script>
import Class from '@/components/Class.vue'
import classDetail from '@/components/classDetail.vue'
import { get } from '@/utils/util'
export default {
    // 导入课程组件和遮罩层组件
    components: {
        Class,
        classDetail
    },
    data () {
        return {
            // 所有课程
            classList: [],
            // 当前周数
            week: 1,
            // 顶部周几显示数组
            weeksStr: ['一', '二', '三', '四', '五', '六', '日'],
            // 左侧课程节数显示数组
            dayLessons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            // 所点击要查看详细信息的课程
            selectLesson: {},
            // 是否显示遮罩层
            isShowDetail: false
        }
    },
    async onShow () {
        // 获取当前周数和所有课程信息
        wx.showLoading({ title: '加载中' })
        await this.getTodayWeek()
        wx.hideLoading()
        await this.getClassList()
    },
    methods: {
        // 获取课程信息
        async getClassList () {
            wx.showLoading({ title: '加载中' })
            try {
                // 尝试从本地存储获取课程信息
                this.classList = wx.getStorageSync('classList')
                wx.hideLoading()
                if (this.classList.length === 0) throw new Error('没有获取到课程信息')
            } catch (e) {
                // 无法获取课程信息要求登录
                wx.hideLoading()
                wx.showToast({
                    title: '请登录',
                    icon: 'none',
                    image: '/static/images/info.png',
                    mask: true
                })
            }
        },
        // 获取当前周数
        async getTodayWeek () {
            const weekData = await get('/weapp/get_week')
            this.week = weekData.data
        },
        // 显示课程详细信息，并传入数据
        showDetail (lesson) {
            this.isShowDetail = true
            this.selectLesson = lesson
        },
        // 是否展示课程详细信息
        toogleDetailVisible () {
            this.isShowDetail = false
        }
    },
    computed: {
    }
}
</script>

<style scoped>
/* 顶部周数样式 */
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
/* 左侧课程节数样式 */
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
/* 分隔线样式 */
.line {
    width: 750rpx;
    position: absolute;
    margin-left: 67.5rpx;
    border-bottom: 1rpx solid;
}
/* 课程表外包裹 */
.table-wrapper {
    display: absolute;
    top: 3vh;
    left: 9vw;
}
</style>
