<template>
    <div>
        <li>
            <card v-for="(item, index) in cardList" :key="index" :imageUrl="item.icon" :name="item.title" :url="payUrl(item.id, item.icon, item.title)"></card>
        </li>
    </div>
</template>

<script>
import Card from '@/components/Card.vue'
import {get} from '@/utils/util'
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
            listData.list.map(item => {
                item.icon = `${config.host}/index_images/${item.icon}`
            })
            this.cardList = listData.list
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
        this.getList()
    }
}
</script>

<style scoped>
</style>
