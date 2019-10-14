const PPTParseSDK = require('../src/index')
let sdk = new PPTParseSDK()

const path = require('path')
const fs = require("fs")

const exmaplePath = path.join(__dirname,'../../../example')

sdk.parsePPT(path.join(exmaplePath,'test7.pptx'),path.join(exmaplePath,'pptOutput1')).then(()=>{
    let json = JSON.stringify(sdk.json)


    fs.writeFileSync(path.join(exmaplePath,'pptOutput1/output.json'))

    let links = Object.keys(sdk.json.fonts).map(c=>{
        return `<link href="https://fonts.googleapis.com/css?family=${c}&display=swap" rel="stylesheet">`
    }).join("\n")

    // res.render(path.join(__dirname,'index.pug'),{json:json,links})
})