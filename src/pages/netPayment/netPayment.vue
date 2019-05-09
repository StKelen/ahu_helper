<template>
    <div>
        <div id="header">
            <div id="wrap-out">
                <div id="img-wrap-in">
                    <img :src="imageUrl" id="header-image">
                </div>
                <p>{{title}}</p>
            </div>
        </div>
        <div id="transprancy"></div>
        <scroll-view scroll-y="true" style="height: 70vh; z-index: 0; margin-top: 30vh;">
            <div style="height: 60vh; padding-top: 10vh;">
                <div class="card">
                    <div class="title">
                        充值金额
                        <span>（单位：元）</span>
                    </div>
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
                <div class="card">
                    <div class="title">充值目标</div>
                    <div class="disabled">
                        <span class="select-info">缴费系统</span>
                        <span class="select-content">城市热点</span>
                    </div>
                </div>
                <div class="card">
                    <div class="title">支付方式</div>
                    <div>
                        <span class="select-info">支付方式</span>
                        <span
                            @click="modalChoose('支付方式', netInfo.payList, 'name', methodChooseResult)"
                            class="select-content"
                        >{{payMethodString}}</span>
                    </div>
                </div>
                <button @click="netPayment">充值!</button>
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
    components: {
        PriceOption,
        Modal
    },
    data () {
        return {
            id: '',
            imageUrl: '',
            title: '',
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
            modalVisible: false,
            modalList: [],
            modalTitle: '',
            modalShowKey: '',
            resultMethod: function () { },
            netInfo: {},
            paymentInfo: {},
            payMethodString: '请选择'
        }
    },
    mounted () {
        this.id = this.$root.$mp.query.id
        this.imageUrl = this.$root.$mp.query.imageUrl
        this.title = this.$root.$mp.query.title
        this.getNetInfo()
    },
    onShow () {
        userValid()
        this.getNetInfo()
    },
    methods: {
        async getNetInfo () {
            const openId = wx.getStorageSync('userInfo').openId
            this.netInfo = (await get(
                '/weapp/get_net_info' + `?open_id=${openId}&id=${this.id}`
            )).data
            console.log(this.netInfo)
        },
        onSelect (index, price) {
            this.paymentInfo.tran = parseFloat(price) * 100
            this.priceList.map((item, i) => {
                item.checked =
                    index === i + 1 &&
                    (item.custom ? item.custom : !item.checked)
                return item
            })
        },
        modalChoose (title, list, showKey, resultMethod) {
            this.modalTitle = title
            this.modalList = list
            this.resultMethod = resultMethod
            this.modalShowKey = showKey
            this.modalVisible = true
        },
        toogleVisible () {
            this.modalVisible = !this.modalVisible
        },
        methodChooseResult (index) {
            // 注意这里是对象，要获取值，用value
            this.paymentInfo.paytype = this.netInfo.payList[index].paytype
            this.payMethodString = this.netInfo.payList[index].name
            this.toogleVisible()
        },
        async netPayment () {
            this.paymentInfo.cookies = this.netInfo.cookies
            this.paymentInfo.account = this.netInfo.studentAccount
            this.paymentInfo.netacc = this.netInfo.netacc
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
            await post('/weapp/net_payment', this.paymentInfo)
        }
    }
}
</script>

<style scoped>
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
#wrap-out {
    position: relative;
    height: 0;
    width: 50%;
    margin: auto;
    padding-bottom: 50%;
    top: 5vh;
}
#img-wrap-in {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
}
#header-image {
    display: block;
    height: 60%;
    width: 100%;
}
#header p {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5%;
    text-align: center;
    font-size: 48rpx;
    color: #444;
}
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

.card {
    width: 700rpx;
    margin: 15rpx auto 30rpx auto;
    padding: 25rpx 0;
    background-color: #fff;
    border-radius: 25rpx;
    box-shadow: 0 0 40rpx 30rpx rgba(225, 225, 225, 0.2),
        0 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.15);
}

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
.content {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    z-index: 0;
}
.select-info {
    display: inline-block;
    font-size: 36rpx;
    width: 150rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin: 20rpx;
    color: #777;
}
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
.disabled {
    background-color: #eee;
}
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

