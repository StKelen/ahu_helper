<template>
    <div>
        <li>
            <card v-for="(item, index) in cardList" :key="index" :imageUrl="item.url" :name="item.title"></card>
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
                item.url = `${config.host}/index_images/${item.url}`
            })
            this.cardList = listData.list
        }
    },
    mounted () {
        this.getList()
    }
}
</script>

<style scoped>
</style>
