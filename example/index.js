const express = require('express')

const app = express()


const PPTParseSDK = require('../src/index')

const path = require('path')

const fs = require("fs")

app.use(express.static(path.join(__dirname,'static')))
app.use(express.static(path.join(__dirname,'pptOutput1/ppt')))



app.use('/test.html',(req,res)=>{
    let sdk = new PPTParseSDK()

    sdk.parsePPT(path.join(__dirname,'../example/test4.pptx')).then(()=>{
        let json = JSON.stringify(sdk.json)
        let filename = path.join(__dirname,'output.json')
        fs.writeFile(filename,json,()=>{

        })

        let links = Object.keys(sdk.json.fonts).map(c=>{
            return `<link href="https://fonts.googleapis.com/css?family=${c}&display=swap" rel="stylesheet">`
        }).join("\n")

        res.render(path.join(__dirname,'index.pug'),{json:json,links})
    })
})

app.listen(9992)