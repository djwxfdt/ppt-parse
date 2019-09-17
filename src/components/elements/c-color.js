
const XElement = require('../../xelement')

/**
 * 封装类,检测 srgbClr | sysClr | schemeClr | scrgbClr | prstClr | hslClr
 */
module.exports = class Color {
    /**
        * @param {XElement} node 
        */
    constructor(node) {

        let srgbClr = node.getSingle("a:srgbClr")
        let schemeClr = node.getSingle("a:schemeClr")

        if(srgbClr){
            this.color = {
                type:"srgbClr",
                value:srgbClr.attributes.val
            }
        }else if(schemeClr){
            this.color = {
                type:"schemeClr",
                value:schemeClr.attributes.val
            }
        }
    }
}