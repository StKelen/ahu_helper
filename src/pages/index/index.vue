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
            cardList: []
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
        },
        toogleNotice () {
            this.noticeVisible = !this.noticeVisible
        }
    },
    mounted () {
        wx.showLoading({ title: '加载中' })
        this.getList()
        wx.hideLoading()
    }
}
</script>

<style scoped>
</style>
