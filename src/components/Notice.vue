<template>
    <div>
        <div class="notice-main">
            <div class="notice-img">{{type}}</div>
            <div class="notice-content">{{content}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'info'
        },
        content: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped>
</style>

