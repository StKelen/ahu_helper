// 配置项

// 服务器端地址
const host = 'https://weapp.ahu.edu.cn'

// 一些服务器端地址配合路由
const config = {
    host,
    loginUrl: `${host}/weapp/login`,
    personUrl: `${host}/person_images`,
    bathUrl: `${host}/bath_images`
}

export default config
