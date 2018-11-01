<template>
    <div>
        <li>
            <card v-for="(item, index) in cardLists" :key="index" :imageUrl="item.imgUrl" :name="item.name"></card>
        </li>
    </div>
</template>

<script>
import Card from '@/components/Card.vue'
export default {
    components: {
        Card
    },
    data () {
        return {
            cardLists: [{
                imgUrl: '../../static/images/card.png',
                name: '校园卡充值'
            }, {
                imgUrl: '../../static/images/light.png',
                name: '照明缴费'
            }, {
                imgUrl: '../../static/images/net.png',
                name: '上网缴费'
            }, {
                imgUrl: '../../static/images/conditioner.png',
                name: '空调缴费'
            }, {
                imgUrl: '../../static/images/speech.png',
                name: '讲座信息'
            }]
        }
    }
}
</script>

<style scoped>
</style>
