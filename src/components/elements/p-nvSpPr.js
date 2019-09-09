const CNvPr = require('./p-cNvPr')
const NvPr = require('./p-nvPr')

/**
 * This element specifies all non-visual properties for a shape. 
 * This element is a container for the non-visual identification properties,
 *  shape properties and application properties that are to be associated with a shape. 
 * This allows for additional information that does not affect the appearance of the shape to be stored.
 */
module.exports = class NvSpPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        
        let cNvPr = node.selectFirst(["p:cNvPr"])
        if(cNvPr){
            this.cNvPr = new CNvPr(cNvPr)
        }

        let nvPr = node.getSingle("p:nvPr")
        if(nvPr){
            this.nvPr = new NvPr(nvPr)
        }
        
    }
}