// 该组件为课程表单个课程模块
<template>
    <!-- 绑定样式、点击时的弹框、类、通过当前周判断是否显示 -->
    <div
        :style="classStyle"
        @click="detail"
        class="class-item"
        v-if="todayWeek >= classInfo.startWeek && todayWeek <= classInfo.endWeek"
    >
        <!-- 课程名称 -->
        <div class="name">{{classInfo.name}}</div>
        <!-- 课程教师 -->
        <div class="teacher">{{classInfo.teacher}}</div>
        <!-- 上课地点 -->
        <div class="position">{{classInfo.position}}</div>
    </div>
</template>

<script>
export default {
    // 通过父组件传入的参数，依次为课程信息、在总课程信息中的项数（用于控制背景颜色）
    props: {
        classInfo: {
            type: Object,
            default: {}
        },
        todayWeek: {
            type: Number,
            default: 0
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            // 课程表背景颜色数组
            colorArrays: [{ start: '#FDEB71', end: '#F8D800' },
                { start: '#04befe', end: '#4481eb' },
                { start: '#f9d423', end: '#ff4e50' },
                { start: '#FFD3A5', end: '#FD6585' },
                { start: '#E2B0FF', end: '#9F44D3' },
                { start: '#FDFC47', end: '#24FE41' },
                { start: '#a8ff78', end: '#78ffd6' }]
        }
    },
    methods: {
        // 显示课程的详细信息
        detail () {
            // 触发父组件显示遮罩层，并传入课程信息
            this.$emit('changeInfo', this.classInfo)
        }
    },
    computed: {
        // 设置课程的样式。包括定位和背景色
        classStyle () {
            return `left: ${(this.classInfo.week - 1) * 13 + 9}vw; top: ${(this.classInfo.startLesson - 1) * 10 + 3.3}vh; height: ${this.classInfo.lessonLength * 9.8}vh; background-image: linear-gradient(135deg, ${this.colorArrays[this.index % 7].start}, ${this.colorArrays[this.index % 7].end});`
        }
    }
}
</script>

<style scoped>
/* 单个课程总体样式 */
.class-item {
    width: 95rpx;
    height: 100px;
    position: absolute;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    font-size: 18rpx;
    box-shadow: 0 0 20rpx 15rpx rgba(225, 225, 225, 0.3),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
    color: #555;
}
/* 各信息排版方式 */
.name,
.teacher,
.position {
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
/* 设置信息的显示行数，多余的将被截断，以“...”显示 */
.name,
.teacher {
    -webkit-line-clamp: 1;
}
.position {
    -webkit-line-clamp: 2;
}
</style>
