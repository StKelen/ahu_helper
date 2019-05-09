const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: '',

    // 微信小程序 App Secret
    appSecret: '',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: '123456',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh',

    // 本地服务器调试
    serverHost: 'localhost',
    tunnelServerUrl: '',
    tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
    // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    qcloudAppId: '1257923247',
    qcloudSecretId: 'AKIDOaXFhuWYy83i8IzsIXXNwPinhLjrmTv7',
    qcloudSecretKey: '6xYtyoOimfJkwyrW1ILAk5B3h5DD3f8L',
    networkTimeout: 30000,

    // 安徽大学服务中心相关配置
    // 网站首页
    hallUrl: 'http://101.76.160.144',
    roomPayUrl: 'http://101.76.160.144/Tsm/Elec_Pay',
    cardPayUrl: 'http://101.76.160.144/User/Account_Pay',
    netPayUrl: 'http://101.76.160.144/Tsm/Net_Pay'
}

module.exports = CONF
