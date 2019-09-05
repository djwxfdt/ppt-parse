const express = require('express')

const app = express()


const PPTParseSDK = require('../src/index')

const path = require('path')

app.use(express.static(path.join(__dirname,'static')))
app.use(express.static(path.join(__dirname,'pptOutput1/ppt')))



app.use('/test.html',(req,res)=>{
    let sdk = new PPTParseSDK()

    sdk.parsePPT(path.join(__dirname,'../example/test.pptx')).then(()=>{
        let json = sdk.json
        res.render(path.join(__dirname,'index.pug'),{json:JSON.stringify(json)})
    })
})

app.listen(9992)