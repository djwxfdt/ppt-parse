const XElement = require('../../xelement')


module.exports = class SolidFill{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        let srgbClr = node.getSingle("a:srgbClr") 
        let schemeClr = node.getSingle("a:schemeClr")


        if(srgbClr && srgbClr.attributes){
            this.srgbClr = srgbClr.attributes.val
        } else if(schemeClr && schemeClr.attributes){
            this.schemeClr = schemeClr.attributes.val
        }
    }


    get color(){
        return this.srgbClr
    }

   
}