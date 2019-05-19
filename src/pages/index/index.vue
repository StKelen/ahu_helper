<template>
    <div>
        <li>
            <card
                :imageUrl="item.icon"
                :key="index"
                :name="item.title"
                :url="payUrl(item.id, item.icon, item.title)"
                v-for="(item, index) in cardList"
            ></card>
        </li>
    </div>
</template>

<script>
import Card from '@/components/Card.vue'
import { get } from '@/utils/util'
import config from '@/config'
export default {
    components: {
        Card
    },
    data () {
        return {
            cardList: [],
            isOpen: false
        }
    },
    methods: {
        async getList () {
            const listData = await get('/weapp/index_list')
            if (listData.code !== 0) return
            const list = listData.data
            list.map(item => {
                item.icon = `${config.host}/index_images/${item.icon}`
            })
            this.cardList = list
        },
        payUrl (id, imageUrl, title) {
            if (id === 1) return '/pages/cardPayment/main?id=' + id + '&imageUrl=' + imageUrl + '&title=' + title
            if (id === 2 || id === 3) return '/pages/elecPayment/main?id=' + id + '&imageUrl=' + imageUrl + '&title=' + title
            if (id === 4) return '/pages/netPayment/main?id=' + id + '&imageUrl=' + imageUrl + '&title=' + title
            if (id === 5) return '/pages/bath/main'
            if (id === 6) return '/pages/passing/main'
        },
        toogleNotice () {
            this.noticeVisible = !this.noticeVisible
        },
        async canIuse () {
            const canUse = await get('/weapp/is_open')
            this.isOpen = canUse.data
            wx.setStorageSync('isOpen', canUse.data)
        }
    },
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
