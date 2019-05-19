<template>
    <div>
        <div class="search">
            <input @input="getSearchWord" id="search" placeholder="搜索课程" type="text">
            <img :src="checkCodeUrl" @click="getPic" alt="验证码">
        </div>
        <ul>
            <li :key="index" v-for="(item, index) in showLessonList">
                <div class="list">
                    <span class="info">课程：</span>
                    <p>{{item.name}}</p>
                </div>
                <div class="list">
                    <span class="info">课程代码：</span>
                    <p>{{item.code}}</p>
                </div>
                <div class="list">
                    <span class="info">课程性质：</span>
                    <p>{{item.nature}}</p>
                </div>
                <div class="list">
                    <span class="info">开课学院：</span>
                    <p>{{item.academy}}</p>
                </div>
                <div class="list">
                    <span class="info">60分以下：</span>
                    <p>{{item['less_sixty']}}%</p>
                </div>
                <div class="list">
                    <span class="info">60分~69分：</span>
                    <p>{{item['sixty_seventy']}}%</p>
                </div>
                <div class="list">
                    <span class="info">70分~79分：</span>
                    <p>{{item['seventy_eighty']}}%</p>
                </div>
                <div class="list">
                    <span class="info">80分~89分：</span>
                    <p>{{item['eighty_ninety']}}%</p>
                </div>
                <div class="list">
                    <span class="info">90分~100分：</span>
                    <p>{{item['ninety_hundred']}}%</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { get } from '@/utils/util'
export default {
    data () {
        return {
            lessonList: [],
            showLessonList: [],
            searchWord: ''
        }
    },
    methods: {
        async getPassingList () {
            const lessonListData = await get('/weapp/passing_list')
            this.lessonList = lessonListData.data
            this.showLessonList = lessonListData.data
        },
        getSearchWord (e) {
            this.searchWord = e.mp.detail.value
        }
    },
    async onLoad () {
        wx.showLoading({ title: '加载中' })
        await this.getPassingList()
        wx.hideLoading()
    },
    watch: {
        searchWord (val) {
            if (!val || val === '') this.showLessonList = this.lessonList
            this.showLessonList = []
            let regStr = this.searchWord.replace(/(.{1})/g, '.*$1')
            regStr += '.*'
            const RegObj = new RegExp(regStr, 'g')
            this.lessonList.forEach(item => {
                if (RegObj.test(item.name)) this.showLessonList.push(item)
            })
        }
    }
}
</script>

<style scoped>
.search {
    position: fixed;
    top: 0;
    left: 0;
    width: 750rpx;
    height: 90rpx;
    background-color: #ffd511;
}
.search input {
    height: 80rpx;
    width: 550rpx;
    margin: auto;
    padding-left: 80rpx;
    font-size: 40rpx;
    font-weight: light;
    color: #999;
    background-size: 40rpx 40rpx;
    background-repeat: no-repeat;
    background-position: 10rpx center;
    background-color: #ffffff;
    border-radius: 40rpx;
    background-image: url('../../../static/images/search.png');
}
li {
    width: 650rpx;
    margin: 15rpx auto 30rpx auto;
    padding: 15rpx 40rpx;
    border-radius: 25rpx;
    background-color: #ffffff;
    box-shadow: 0 0 40rpx 30rpx rgba(225, 225, 225, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
}
ul {
    margin-top: 100rpx;
}
.list {
    margin: 10rpx 0;
}
.list p {
    display: inline;
    font-size: 32rpx;
    color: #999;
}
.info {
    font-size: 36rpx;
    font-weight: bold;
    color: #6a6a6a;
}
</style>
