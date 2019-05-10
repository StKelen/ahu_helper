<template>
    <div>
        <div id="today">
            <div class="man">
                <ul>
                    <li :key="index" v-for="(item,index) in arrange.today.man">{{item}}</li>
                </ul>
            </div>
            <div class="woman">
                <ul>
                    <li :key="index" v-for="(item,index) in arrange.today.woman">{{item}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            arrange: {
                today: {
                    man: ['南区浴室', '蕙园浴室'],
                    woman: ['北区浴室']
                },
                tomorrow: {
                    man: ['北区浴室'],
                    woman: ['南区浴室', '蕙园浴室']
                }
            }
        }
    }
}
</script>
<style scoped>
</style>
