<template>
    <div>
        <div class="logo">
            <img :src="logoUrl" alt="">
        </div>
        <p id="version">1.0.0</p>
        <ul class="list">
            <li v-for="(item, index) in sourceList" :key="index">
                <span class="list-name">{{item.name}}</span>
                <span class="list-author">{{item.author}}</span>
                <p class="list-desc">{{item.desc}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import config from '@/config'
export default {
    data () {
        return {
            logoUrl: `${config.personUrl}/arcode.png`,
            sourceList: [{
                name: 'mpvue',
                author: '美团点评',
                desc: 'mpvue 是一个使用 Vue.js 开发小程序的前端框架。框架基于 Vue.js 核心，mpvue 修改了 Vue.js 的 runtime 和 compiler 实现，使其可以运行在小程序环境中，从而为小程序开发引入了整套 Vue.js 开发体验。'
            }, {
                name: 'element',
                author: '饿了么前端',
                desc: 'Element UI 是一套采用 Vue 2.0 作为基础框架实现的组件库，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的组件库，提供了配套设计资源，帮助网站快速成型。'
            }, {
                name: 'Font Awesome',
                author: 'Font Awesome',
                desc: 'Font Awesome is a font and icon toolkit based on CSS and LESS. It was made by Dave Gandy for use with Twitter Bootstrap, and later was incorporated into the BootstrapCDN.'
            }, {
                name: 'Ant Design',
                author: 'Ant Design Team',
                desc: '一套企业级的 UI 设计语言和 React 实现。'
            }, {
                name: 'wafer2-client-sdk',
                author: '腾讯云',
                desc: '为小程序客户端开发提供 SDK 支持会话服务和信道服务。'
            }, {
                name: 'wafer2-node-sdk',
                author: '腾讯云',
                desc: 'Wafer 服务端 SDK 是腾讯云为微信小程序开发者提供的快速开发库'
            }, {
                name: 'Super Agent',
                author: 'Sloth',
                desc: 'SuperAgent is a small progressive client-side and Node.js HTTP request library, sporting many high-level HTTP client features.'
            }, {
                name: 'cheerio',
                author: 'cheeriojs',
                desc: 'Fast, flexible, and lean implementation of core jQuery designed specifically for the server.'
            }]
        }
    }
}
</script>

<style scoped>
.logo{
    margin-top: 50rpx;
}
.logo img{
    display: block;
    width: 300rpx;
    height: 300rpx;
    margin: auto;
}
#version{
    margin-top: 30rpx;
    color: #999;
    font-size: 32rpx;
    text-align: center;
}
.list{
    margin-top: 100rpx;
}
.list li{
    display: block;
    width: 600rpx;
    margin: 15rpx auto 30rpx auto;
    padding: 25rpx;
    background-color: #fff;
    border-radius: 25rpx;
    box-shadow: 0 0 40rpx 30rpx rgba(225, 225, 225, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
}

.list-name{
    float: left;
    font-size: 48rpx;
    font-weight: bold;
    color: #444;
}
.list-author{
    float: right;
    padding-top: 24rpx;
    padding-right: 24rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #6A6A6A;
}
.list-desc{
    padding-top: 12rpx;
    clear: both;
    color: #999;
    font-size: 24rpx;
}
</style>
