// 首页
<template>
    <div>
        <li>
            <!-- 循环卡片，依次绑定图片地址、顺序、名称、跳转连接 -->
            <card
                :imageUrl="item.icon"
                :key="index"
                :name="item.title"
                :url="gotoUrl(item.id, item.icon, item.title)"
                v-for="(item, index) in cardList"
            ></card>
        </li>
    </div>
</template>

<script>
import Card from '@/components/Card.vue'
import { get } from '@/utils/util'
import config from '@/config'
// 导入卡片组件
export default {
    components: {
        Card
    },
    data () {
        return {
            // 卡片列表
            cardList: [],
            // 是否启用支付功能
            isOpen: false
        }
    },
    methods: {
        // 获取首页列表
        async getList () {
            const listData = await get('/weapp/index_list')
            if (listData.code !== 0) return
            const list = listData.data
            list.map(item => {
                item.icon = `${config.host}/index_images/${item.icon}`
            })
            this.cardList = list
        },
        // 设置各卡片组件跳转地址
        gotoUrl (id, imageUrl, title) {
            if (id === 1) return '/pages/cardPayment/main?id=' + id + '&imageUrl=' + imageUrl + '&title=' + title
            if (id === 2 || id === 3) return '/pages/elecPayment/main?id=' + id + '&imageUrl=' + imageUrl + '&title=' + title
            if (id === 4) return '/pages/netPayment/main?id=' + id + '&imageUrl=' + imageUrl + '&title=' + title
            if (id === 5) return '/pages/bath/main'
            if (id === 6) return '/pages/passing/main'
        },
        // 从服务器判断是否启用支付功能，写入存储
        async canIuse () {
            const canUse = await get('/weapp/is_open')
            this.isOpen = canUse.data
            wx.setStorageSync('isOpen', canUse.data)
        }
    },
    // 页面加载时获取首页卡片列表，判断是否启用支付功能
    async onLoad () {
        wx.showLoading({ title: '加载中' })
        await this.canIuse()
        await this.getList()
        wx.hideLoading()
    }
}
</script>

<style scoped>
</style>
