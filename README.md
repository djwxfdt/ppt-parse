## pptx解析工具

### 服务端


1. 安装： `npm install pptx-parse --save`
2. 使用方式:

```
const SDK = require('pptx-parse')
const sdk = new SDK()
sdk.parsePPT('xxxx.pptx','outputFolder').then(()=>{
    res.send({pptJson:sdk.json})
})
```
    

### 客户端（重构中...）

1. 安装： `npm install pptx-sdk-js --save`

2. 使用方式：

```
    import PptSDK from "pptx-sdk-js"

    const App = ()=> <div>
        <PptSDK jsonObj={...} />
    </div>

```