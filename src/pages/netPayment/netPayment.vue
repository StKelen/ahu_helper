// 个人网费支付界面
<template>
    <!-- 判断是否可用 -->
    <div v-if="canUse">
        <!-- 顶部装饰 -->
        <div id="header">
            <div id="wrap-out">
                <div id="img-wrap-in">
                    <img :src="imageUrl" id="header-image">
                </div>
                <p>{{title}}</p>
            </div>
        </div>
        <!-- 顶部装饰下面的阴影 -->
        <div id="transprancy"></div>
        <!-- 下面支付功能的滚动页面 -->
        <scroll-view scroll-y="true" style="height: 70vh; z-index: 0; margin-top: 30vh;">
            <div style="height: 60vh; padding-top: 10vh;">
                <!-- 支付金额部分 -->
                <div class="card">
                    <!-- 顶部标题 -->
                    <div class="title">
                        &#x5145;&#x503C;&#x91D1;&#x989D;
                        <span>&#xFF08;&#x5355;&#x4F4D;&#xFF1A;&#x5143;&#xFF09;</span>
                    </div>
                    <!-- 支付金额组件，分别绑定是否选中、是否自定义、循环项数、价格、选中相关事件 -->
                    <div class="content">
                        <price-option
                            :checked="item.checked"
                            :custom="item.custom"
                            :index="item.index"
                            :key="item.index"
                            :price="item.price"
                            @select="onSelect"
                            v-for="item in priceList"
                        ></price-option>
                    </div>
                </div>
                <!-- 充值目标部分 -->
                <div class="card">
                    <div class="title">充值目标</div>
                    <!-- 因为支付系统只有这一种支付目标，所以目前写死 -->
                    <div class="disabled">
                        <span class="select-info">缴费系统</span>
                        <span class="select-content">城市热点</span>
                    </div>
                </div>
                <!-- 支付方式部分 -->
                <div class="card">
                    <div class="title">支付方式</div>
                    <div>
                        <span class="select-info">支付方式</span>
                        <!-- 设置遮罩层是否显示，传入相关数据 -->
                        <span
                            @click="modalChoose('支付方式', netInfo.payList, 'name', methodChooseResult)"
                            class="select-content"
                        >{{payMethodString}}</span>
                    </div>
                </div>
                <button @click="netPayment">充值!</button>
                <!-- 遮罩层，绑定选择列表、展示文字的对象属性名称、题目、是否课件、选择结果、开关显示 -->
                <modal
                    :list="modalList"
                    :showKey="modalShowKey"
                    :title="modalTitle"
                    :visible="modalVisible"
                    @resultMethod="resultMethod"
                    @toogleVisible="toogleVisible"
                ></modal>
            </div>
        </scroll-view>
    </div>
</template>

<script>
import PriceOption from '@/components/PriceOption.vue'
import Modal from '@/components/Modal.vue'
import { get, post, userValid } from '@/utils/util'
export default {
    // 价格选择组件和遮罩组件
    components: {
        PriceOption,
        Modal
    },
    data () {
        return {
            // 是否可用
            canUse: false,
            // 当前支付类型的顺序
            id: 4,
            // 顶部装饰的图片链接
            imageUrl: '',
            // 顶部装饰的介绍文字
            title: '',
            // 支付价格数组，和价格选择组件相关
            priceList: [
                {
                    index: 1,
                    price: 10,
                    checked: false,
                    custom: false
                },
                {
                    index: 2,
                    price: 20,
                    checked: false,
                    custom: false
                },
                {
                    index: 3,
                    price: 50,
                    checked: false,
                    custom: false
                },
                {
                    index: 4,
                    price: 100,
                    checked: false,
                    custom: false
                },
                {
                    index: 5,
                    price: 150,
                    checked: false,
                    custom: false
                },
                {
                    index: 6,
                    price: 200,
                    checked: false,
                    custom: false
                },
                {
                    index: 7,
                    price: 500,
                    checked: false,
                    custom: false
                },
                {
                    index: 8,
                    price: '',
                    checked: false,
                    custom: true
                }
            ],
            // 遮罩层相关数据
            modalVisible: false,
            modalList: [],
            modalTitle: '',
            modalShowKey: '',
            // 遮罩层选择相关数据后出发的函数
            resultMethod: function () { },
            // 个人支付信息
            netInfo: {},
            // 支付请求相关参数
            paymentInfo: {},
            // 在前端界面的显示文字
            payMethodString: '请选择'
        }
    },
    onLoad () {
        // 加载时初始化数据
        Object.assign(this.$data, this.$options.data())
        // 传入相关页面数据
        this.id = this.$root.$mp.query.id
        this.imageUrl = this.$root.$mp.query.imageUrl
        this.title = this.$root.$mp.query.title
        // 判断是否可用
        this.canIuse()
    },
    async onShow () {
        // 获取用户个人支付信息
        if (this.canUse) {
            await userValid()
            wx.showLoading({ title: '加载中' })
            await this.getNetInfo()
            wx.hideLoading()
        }
    },
    methods: {
        // 判断是否可用，优先从本地存储中获取数据
        async canIuse () {
            wx.showLoading({ title: '加载中' })
            try {
                this.canUse = wx.getStorageSync('isOpen')
            } catch (e) {
                const isOpen = await get('/weapp/is_open')
                this.canUse = isOpen.data
            }
            wx.hideLoading()
        },
        // 获取用户个人支付信息
        async getNetInfo () {
            const openId = wx.getStorageSync('userInfo').openId
            this.netInfo = (await get(
                '/weapp/get_net_info' + `?open_id=${openId}&id=${this.id}`
            )).data
        },
        // 与价格选择组件一起，执行选择后参数处理
        onSelect (index, price) {
            // 获取价格，学校支付系统以分为单位
            this.paymentInfo.tran = parseFloat(price) * 100
            // 设置是否被选中的处理，影响样式
            this.priceList.map((item, i) => {
                item.checked =
                    index === i + 1 &&
                    (item.custom ? item.custom : !item.checked)
                return item
            })
        },
        // 控制遮罩相关数据
        modalChoose (title, list, showKey, resultMethod) {
            this.modalTitle = title
            this.modalList = list
            this.resultMethod = resultMethod
            this.modalShowKey = showKey
            this.modalVisible = true
        },
        // 开关遮罩层显示
        toogleVisible () {
            this.modalVisible = !this.modalVisible
        },
        // 设置支付方式的遮罩参数
        methodChooseResult (index) {
            this.paymentInfo.paytype = this.netInfo.payList[index].paytype
            this.payMethodString = this.netInfo.payList[index].name
            this.toogleVisible()
        },
        // 发起支付的请求
        async netPayment () {
            // 获取支付系统的cookies，设置相关支付数据
            this.paymentInfo.cookies = this.netInfo.cookies
            this.paymentInfo.account = this.netInfo.studentAccount
            this.paymentInfo.netacc = this.netInfo.netacc
            // 防止用户输入错误的参数，进行客户端验证
            if (!this.paymentInfo.tran || this.paymentInfo.tran === 0 || isNaN(this.paymentInfo.tran)) {
                wx.showToast({
                    title: '充值金额错误',
                    icon: 'none',
                    image: '/static/images/warning.png',
                    mask: true
                })
                return
            }
            if (!this.paymentInfo.paytype || this.paymentInfo.paytype === 0 || this.paymentInfo.paymentInfo === '0') {
                wx.showToast({
                    title: '请选择支付方式',
                    icon: 'none',
                    image: '/static/images/warning.png',
                    mask: true
                })
                return
            }
            wx.showLoading({ title: '支付中' })
            // 发起支付请求
            const payReturnData = await post('/weapp/net_payment', this.paymentInfo)
            wx.hideLoading()
            // 返回支付信息
            if (payReturnData.code === 0) {
                wx.showToast({
                    title: '缴费成功',
                    icon: 'none',
                    image: '/static/images/success.png',
                    mask: true
                })
                // 支付成功后返回上一页
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 2000)
            } else {
                wx.showToast({
                    title: payReturnData.data,
                    icon: 'none',
                    image: '/static/images/warning.png',
                    mask: true
                })
            }
        }
    }
}
</script>

<style scoped>
/* 顶部装饰 */
#header {
    width: 100%;
    height: 40vh;
    background-color: #fff;
    box-shadow: 0 0 40rpx 30rpx rgba(225, 225, 225, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
    border-radius: 0 0 10vh 10vh;
    position: fixed;
    top: 0;
    z-index: 2;
}
/* 顶部装饰包裹 */
#wrap-out {
    position: relative;
    height: 0;
    width: 50%;
    margin: auto;
    padding-bottom: 50%;
    top: 5vh;
}
/* 顶部图片包裹 */
#img-wrap-in {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
}
/* 顶部装饰图片宽高设定 */
#header-image {
    display: block;
    height: 60%;
    width: 100%;
}
/* 顶部装饰文字介绍 */
#header p {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5%;
    text-align: center;
    font-size: 48rpx;
    color: #444;
}
/* 顶部装饰文字旁的装饰线 */
#header p::before,
p::after {
    display: inline-block;
    content: '';
    width: 100rpx;
    height: 5rpx;
    margin-bottom: 14rpx;
    background-color: #444;
}
#header p::before {
    margin-left: -150rpx;
    margin-right: 30rpx;
}
#header p::after {
    margin-right: -150rpx;
    margin-left: 30rpx;
}

/* 顶部装饰下方阴影 */
#transprancy {
    position: fixed;
    height: 14vh;
    width: 100vw;
    top: 30vh;
    background-image: linear-gradient(
        180deg,
        rgba(244, 247, 252, 1) 40%,
        rgba(244, 247, 252, 0.75) 80%,
        rgba(244, 247, 252, 0) 100%
    );
    z-index: 1;
}

/* 单个卡片样式 */
.card {
    width: 700rpx;
    margin: 15rpx auto 30rpx auto;
    padding: 25rpx 0;
    background-color: #fff;
    border-radius: 25rpx;
    box-shadow: 0 0 40rpx 30rpx rgba(225, 225, 225, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
}

/* 卡片的标题 */
.title {
    padding-bottom: 10rpx;
    padding-left: 30rpx;
    font-size: 40rpx;
    font-weight: bold;
    color: #444;
    z-index: 0;
}
.title span {
    font-size: 24rpx;
    padding-left: 20rpx;
}
/* 多个付款金额选项布局 */
.content {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    z-index: 0;
}
/* 选择列样式 */
.select-info {
    display: inline-block;
    font-size: 36rpx;
    width: 150rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin: 20rpx;
    color: #777;
}
/* 输入框样式 */
.select-content {
    display: inline-block;
    position: relative;
    width: 400rpx;
    font-size: 32rpx;
    line-height: 60rpx;
    padding-left: 20rpx;
    margin-left: 50rpx;
    color: #666;
}
/* 被写死的支付目标 */
.disabled {
    background-color: #eee;
}
/* 右边装饰箭头 */
.select-content::after {
    content: '';
    float: right;
    display: block;
    background-image: url('../../../static/images/target.png');
    background-repeat: no-repeat;
    margin-top: 10rpx;
    width: 40rpx;
    height: 40rpx;
    background-size: 40rpx 40rpx;
}
/* 支付按钮相关样式 */
button {
    width: 550rpx;
    height: 100rpx;
    margin: 50rpx auto;
    border-radius: 50rpx;
    font-size: 50rpx;
    line-height: 100rpx;
    background-image: linear-gradient(135deg, #ffc500 5%, #ffb200);
    color: #3c3c3c;
}
button::after {
    border: 0;
}
</style>

