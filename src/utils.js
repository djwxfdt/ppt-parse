const xml2js = require('xml2js')

const XElement = require("./xelement")

let xmlParser = null

try {
    xmlParser = require("../build/Release/rapidxml")
} catch (error) {
    console.warn(error,"rapidxml 不存在，将使用xml2js替代")
}


/**
 * @param {*} str 
 */
const parseString = Type => str => {

    /**
     * 使用c++解析会加快解析速度，并且在节点为空格的时候不会丢弃
     */
    if(xmlParser){
        let jsonObj = xmlParser.parseString(str)
        return new Promise((r)=>r(new Type(jsonObj)))
    }

    return new Promise((resolve, reject) => {
        xml2js.parseString(str, {
            attrkey: "attrs",
            childkey: "children",
            explicitChildren:true,
            preserveChildrenOrder:true,
            includeWhiteChars:true,
            normalize:false,
            // explicitCharkey:true,
            trim:false,
        }, (err, res) => {
            if (err) {
                reject(err)
            } else {
                let obj = res[Object.keys(res)[0]]
                resolve(new Type(obj))
            }
        })
    })

}

// class Test{
//     constructor(n){
//         debugger
//     }
// }

// parseString(Test)(`<a:r>
// <a:t>1</a:t>
// </a:r>`)

const searchXML = xml => arry => {

    for (let i = 0; i < arry.length; i++) {
        if (!xml) {
            break
        }
        if (Array.isArray(xml)) {
            xml = xml[0][arry[i]]
            continue
        }
        xml = xml[arry[i]]
    }

    return xml
}

const FONT_MAP = {
    "楷体":"cursive",
    "华文行楷":"cursive"
}

const mapFont = name =>{
    return FONT_MAP[name] || name
}

module.exports = {searchXML,parseString,mapFont}