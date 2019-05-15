<template>
    <div
        :style="classStyle"
        @click="detail"
        class="class-item"
        v-if="todayWeek >= classInfo.startWeek && todayWeek <= classInfo.endWeek"
    >
        <div class="name">{{classInfo.name}}</div>
        <div class="teacher">{{classInfo.teacher}}</div>
        <div class="position">{{classInfo.position}}</div>
    </div>
</template>

<script>
export default {
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
        detail () {
            this.$emit('changeInfo', this.classInfo)
        }
    },
    computed: {
        classStyle () {
            return `left: ${(this.classInfo.week - 1) * 13 + 9}vw; top: ${(this.classInfo.startLesson - 1) * 10 + 3.3}vh; height: ${this.classInfo.lessonLength * 9.8}vh; background-image: linear-gradient(135deg, ${this.colorArrays[this.index % 7].start}, ${this.colorArrays[this.index % 7].end});`
        }
    }
}
</script>

<style scoped>
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
.name,
.teacher,
.position {
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.name,
.teacher {
    -webkit-line-clamp: 1;
}
.position {
    -webkit-line-clamp: 2;
}
</style>
