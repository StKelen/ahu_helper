# 小安生活帮·小程序

这是微信小程序小安生活帮的源代码

## 编译及运行

``` bash
# 安装依赖
npm install
# 或
yarn

# 开发时构建
npm dev
# 或
yarn dev

# 打包构建
npm build
# 或
yarn build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm dev:wx
npm dev:swan
npm dev:tt
npm dev:my
# 或
yarn dev:wx
yarn dev:swan
yarn dev:tt
yarn dev:my

# 指定平台的打包构建
npm build:wx
npm build:swan
npm build:tt
npm build:my
# 或
yarn build:wx
yarn build:swan
yarn build:tt
yarn build:my
```

## 项目结构

> 卷 System 的文件夹 PATH 列表
> 卷序列号为 0F19-0AAA
> C:.
> ├─build
> ├─config
> ├─dist
> │  └─wx
> │      ├─common
> │      ├─components
> │      ├─pages
> │      │  ├─about
> │      │  ├─bath
> │      │  ├─cardPayment
> │      │  ├─elecPayment
> │      │  ├─index
> │      │  ├─netPayment
> │      │  ├─openSource
> │      │  ├─passing
> │      │  ├─person
> │      │  ├─personInfo
> │      │  └─timeTable
> │      └─static
> │          └─images 
> ├─node_modules
> ├─server
> │  ├─controllers
> │  ├─middlewares
> │  ├─node_modules
> │  ├─public
> │  │  ├─bath_images
> │  │  ├─index_images
> │  │  └─person_images
> │  ├─routes
> │  ├─tools
> │  └─utils
> ├─src
> │  ├─components
> │  ├─pages
> │  │  ├─about
> │  │  ├─bath
> │  │  ├─cardPayment
> │  │  ├─elecPayment
> │  │  ├─index
> │  │  ├─netPayment
> │  │  ├─openSource
> │  │  ├─passing
> │  │  ├─person
> │  │  ├─personInfo
> │  │  └─timeTable
> │  └─utils
> └─static
>     └─images