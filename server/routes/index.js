/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware } } = require('../qcloud')
const hallLogin = require('../middlewares/login')

// 登录接口
router.get('/login', hallLogin, authorizationMiddleware, controllers.login)

// 主页路由
router.get('/index_list', controllers.indexList)
// 获取验证码图片和Cookies路由
router.get('/get_check_code_cookie', controllers.getCheckCode.getPicWithoutCookie)
// 获取验证码图片路由
router.get('/get_check_code', controllers.getCheckCode.getPicWithCookie)
// 获取卡片支付信息路由
router.get('/get_card_info', controllers.getCardInfo)
// 发起校园卡支付请求路由
router.post('/card_payment', controllers.cardPayment)
// 获取寝室支付相关信息路由
router.get('/get_room_info', controllers.getRoomInfo)
// 发起寝室支付相关请求路由
router.post('/room_payment', controllers.roomPayment)
// 获取网络支付相关信息路由
router.get('/get_net_info', controllers.getNetInfo)
// 发起网络支付请求路由
router.post('/net_payment', controllers.netPayment)
// 获取用户个人信息路由
router.get('/user_info', controllers.getUserInfo)
// 验证登录状态是否有效路由
router.post('/check_valid', controllers.checkValid)
router.get('/bath_info', controllers.bathInfo)

module.exports = router
