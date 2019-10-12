const xml2js = require('xml2js')

const XElement = require('./xelement')

const d3 = require('d3-color')

let xmlParser = null

try {
    xmlParser = require('../build/Release/rapidxml')
} catch (error) {
    console.warn(error, 'rapidxml 不存在，将使用xml2js替代')
}

/**
 * @param {*} str
 */
const parseString = Type => str => {
    /**
     * 使用c++解析会加快解析速度，并且在节点为空格的时候不会丢弃
     */
    if (xmlParser) {
        const jsonObj = xmlParser.parseString(str)
        return new Promise((r) => r(new Type(jsonObj)))
    }

    return new Promise((resolve, reject) => {
        xml2js.parseString(str, {
            attrkey: 'attrs',
            childkey: 'children',
            explicitChildren: true,
            preserveChildrenOrder: true,
            includeWhiteChars: true,
            normalize: false,
            // explicitCharkey:true,
            trim: false
        }, (err, res) => {
            if (err) {
                reject(err)
            } else {
                const obj = res[Object.keys(res)[0]]
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
    楷体: 'cursive',
    华文行楷: 'cursive'
}

const GOOGLE_FONTS = {
    Corbel: 'Rubik',
    Calibri: 'Lato',
    Muli: 'Muli',
    'Muli Light': 'Muli:300,400',
    Poppins: 'Poppins',
    'Poppins Light': 'Poppins:300,400',
    'Stone Sans ITC TT-Semi': 'Handlee'

}

const mapFont = name => {
    return [name, 'Helvetica', 'cursive']
}

const applyLumColor = ({ value, lumMod, lumOff, tint, alpha }) => {
    if (!value) {
        return
    }

    lumMod = (lumMod || 0) / 100
    lumOff = (lumOff || 0) / 100

    let hsl = d3.hsl('#' + value)

    if (lumOff != 0) {
        hsl.l = hsl.l * (1 + lumOff)
    }

    if (tint) {
        const rgb = hsl.rgb()
        rgb.r = rgb.r * tint / 100 + 255 * (1 - tint / 100)
        rgb.g = rgb.g * tint / 100 + 255 * (1 - tint / 100)
        rgb.b = rgb.b * tint / 100 + 255 * (1 - tint / 100)
        hsl = d3.hsl(rgb)
    }
    let hex = hsl.hex().replace('#', '')
    if (alpha) {
        hex = Math.floor(255 * alpha / 100).toString('16') + hex
    }
    return hex
    // return hsl.rgb()
}

module.exports = { searchXML, parseString, mapFont, applyLumColor, GOOGLE_FONTS }
