# Ahu Helper
This registry of Ahu Helper Mini Program.

## Install Dependencies
``` bash
npm install
# OR
yarn
```
## Develop
``` bash
npm dev
# OR
yarn dev

# Develop for a specific platform (WeChat、Baidu、TikTok、Alipay)
npm dev:wx
npm dev:swan
npm dev:tt
npm dev:my
# OR
yarn dev:wx
yarn dev:swan
yarn dev:tt
yarn dev:my
```

## Build
``` bash
npm build
# OR
yarn build

# Build for a specific platform
npm build:wx
npm build:swan
npm build:tt
npm build:my
# OR
yarn build:wx
yarn build:swan
yarn build:tt
yarn build:my
```

## Project Structure
```
├─build  -------------------------------------  Build Scripts  
├─config  ------------------------------------  Build Configuration
├─server  ------------------------------------  Server Source Code
│ ├─controllers  -----------------------------  Server Controllers 
│ ├─middlewares  -----------------------------  Sever Middlewares 
│ ├─public  ----------------------------------  Server Static Files
│ │ ├─bath_images  ---------------------------  Images for /bath pages
│ │ ├─index_images  --------------------------  Images for home pages  
│ │ └─person_images  -------------------------  Images for /person pages
│ ├─routes  ----------------------------------  Server Routes
│ ├─tools  -----------------------------------  Server Initate Scripts
│ └─utils  -----------------------------------  Server Utils Scripts
├─src  ---------------------------------------  Client Source Code  
│ ├─components  ------------------------------  Client Shared Components
│ ├─pages  -----------------------------------  Client Pages
│ │ ├─about  ---------------------------------  About Page
│ │ ├─bath  ----------------------------------  Schedule of Bathroom Page
│ │ ├─cardPayment  ---------------------------  Charge Student Card Page
│ │ ├─elecPayment  ---------------------------  Recharge Electricity Page
│ │ ├─index  ---------------------------------  Homepage
│ │ ├─netPayment  ----------------------------  Recharge Network Fees Page
│ │ ├─openSource  ----------------------------  Open Source Page
│ │ ├─passing  -------------------------------  Examination Result Query Page
│ │ ├─person  --------------------------------  Personal Page
│ │ ├─personInfo  ----------------------------  Personal Info Page
│ │ └─timeTable  -----------------------------  Class TimeTable Page
│ └─utils  -----------------------------------  Client Shared Utils
└─static  ------------------------------------  Client Static Images
 └─images
```
